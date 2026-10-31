import { ConsoleStdout, File, OpenFile, PreopenDirectory, WASI } from "@bjorn3/browser_wasi_shim";
import { RubyVM } from "@ruby/wasm-wasi";
import { Game } from "./games";

export interface RubyTerminal {
  write: (text: string) => void;
  readLine: () => Promise<string>;
  readKey: () => Promise<string>;
  sleep: (seconds: number) => Promise<void>;
}

declare global {
  // eslint-disable-next-line no-var
  var rubyTerminal: RubyTerminal | undefined;
}

let rubyModule: Promise<WebAssembly.Module> | null = null;

const loadRubyModule = () => {
  rubyModule ??= fetch("/ruby/ruby+stdlib.wasm")
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.compile(bytes));

  return rubyModule;
};

const fetchBytes = async (path: string) =>
  new Uint8Array(await (await fetch(path)).arrayBuffer());

export const runRubyGame = async (game: Game, terminal: RubyTerminal) => {
  const [module, prelude, ...gameFiles] = await Promise.all([
    loadRubyModule(),
    fetch("/games/prelude.rb").then((response) => response.text()),
    ...game.files.map((file) => fetchBytes(`/games/${game.slug}/${file}`)),
  ]);

  const decoder = new TextDecoder();
  const output = (bytes: Uint8Array) => terminal.write(decoder.decode(bytes, { stream: true }));
  const files = new Map(game.files.map((name, index) => [name, new File(gameFiles[index])]));

  const wasi = new WASI([], [], [
    new OpenFile(new File([])),
    new ConsoleStdout(output),
    new ConsoleStdout(output),
    new PreopenDirectory("/", files),
  ], { debug: false });

  const { vm } = await RubyVM.instantiateModule({ module, wasip1: wasi });

  globalThis.rubyTerminal = terminal;
  await vm.evalAsync(prelude);
  await vm.evalAsync(`Dir.chdir("/"); load "/${game.entry}"`);
};
