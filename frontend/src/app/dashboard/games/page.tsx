import Link from "next/link";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { games } from "../../../games/games";

const GamesPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-xl font-semibold">Games</h1>

      <ul className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <li key={game.slug}>
            <Link
              href={`/dashboard/games/${game.slug}`}
              className="card flex items-center justify-between gap-3 transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{game.title}</span>
                <span className="tag">{game.language}</span>
              </div>
              <PlayArrowRoundedIcon className="text-blue-500 dark:text-emerald-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamesPage;
