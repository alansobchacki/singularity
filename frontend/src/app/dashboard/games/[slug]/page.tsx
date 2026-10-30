"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { games } from "../../../../games/games";
import GameTerminal from "../../../../components/games/GameTerminal";
import Button from "../../../../components/Button";

const GamePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [runId, setRunId] = useState(0);
  const game = games.find((candidate) => candidate.slug === slug);

  if (!game) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/games"
            aria-label="Back to games"
            className="rounded-lg p-1.5 hover:bg-gray-300 dark:hover:bg-slate-800"
          >
            <ArrowBackIcon fontSize="small" />
          </Link>
          <h1 className="text-xl font-semibold">{game.title}</h1>
        </div>
        <Button variant="secondary" onClick={() => setRunId((id) => id + 1)} aria-label="Restart" title="Restart">
          <RestartAltIcon fontSize="small" />
        </Button>
      </header>

      <GameTerminal key={runId} game={game} />
    </div>
  );
};

export default GamePage;
