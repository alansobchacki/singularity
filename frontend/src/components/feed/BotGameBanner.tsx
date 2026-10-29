interface BotGameBannerProps {
  scores: { correct: number; total: number };
}

const BotGameBanner = ({ scores }: BotGameBannerProps) => {
  return (
    <div className="card flex items-center justify-between gap-4 border-dashed">
      <p className="text-sm">
        <span className="font-semibold">Human or bot?</span>{" "}
        <span className="text-muted">
          Some accounts here are AI. Guess 🤖 or 🧑 on each post.
        </span>
      </p>
      <p className="shrink-0 dark:font-mono text-sm">
        {scores.correct}/{scores.total}
      </p>
    </div>
  );
};

export default BotGameBanner;
