"use client";

import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import { Game } from "../../games/games";
import LoadingSpinner from "../LoadingSpinner";

interface PendingRead {
  mode: "line" | "key";
  resolve: (value: string) => void;
  reject: (reason: Error) => void;
}

const GameTerminal = ({ game }: { game: Game }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const [{ Terminal }, { FitAddon }, { runRubyGame }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
        import("../../games/rubyRuntime"),
      ]);
      if (disposed || !containerRef.current) return;

      const terminal = new Terminal({
        convertEol: true,
        cursorBlink: true,
        fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
        fontSize: 14,
        theme: { background: "#020617", foreground: "#e2e8f0" },
      });
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(containerRef.current);
      fitAddon.fit();

      let pending: PendingRead | null = null;
      let line = "";

      const finishRead = (value: string) => {
        const read = pending;
        pending = null;
        read?.resolve(value);
      };

      const input = terminal.onData((data) => {
        if (pending?.mode === "key") return finishRead(data);
        if (!pending) return;

        for (const char of data) {
          if (char === "\r") {
            terminal.write("\r\n");
            finishRead(`${line}\n`);
            line = "";
            return;
          }

          if (char === "\x7f") {
            if (line) {
              line = line.slice(0, -1);
              terminal.write("\b \b");
            }
          } else if (char >= " ") {
            line += char;
            terminal.write(char);
          }
        }
      });

      const read = (mode: PendingRead["mode"]) =>
        new Promise<string>((resolve, reject) => {
          pending = { mode, resolve, reject };
        });

      const handleResize = () => fitAddon.fit();
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        window.removeEventListener("resize", handleResize);
        input.dispose();
        pending?.reject(new Error("Game closed"));
        terminal.dispose();
      };

      terminal.focus();

      try {
        await runRubyGame(game, {
          write: (text) => {
            if (disposed) return;
            setIsLoading(false);
            terminal.write(text);
          },
          readLine: () => read("line"),
          readKey: () => read("key"),
          sleep: (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000)),
        });
      } catch (error) {
        if (disposed) return;
        setIsLoading(false);
        terminal.write(`\r\n\x1b[31m${error instanceof Error ? error.message : error}\x1b[0m\r\n`);
      }
    };

    start();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [game]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-300 bg-[#020617] p-3 shadow-md dark:border-slate-800 dark:shadow-none">
      <div ref={containerRef} className="h-[520px]" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020617]">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default GameTerminal;
