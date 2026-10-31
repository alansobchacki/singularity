const chessBackRow = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];

const ChessPreview = () => (
  <div className="grid grid-cols-8 overflow-hidden rounded-sm text-sm leading-none">
    {Array.from({ length: 64 }, (_, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      const piece = row === 0 || row === 7 ? chessBackRow[col] : row === 1 || row === 6 ? "♟" : "";
      const square = index === 52 ? "bg-sky-700" : (row + col) % 2 ? "bg-slate-700" : "bg-slate-600";

      return (
        <span
          key={index}
          className={`flex h-4 w-5 items-center justify-center ${square} ${row < 2 ? "text-sky-300" : "text-fuchsia-300"}`}
        >
          {piece}
        </span>
      );
    })}
  </div>
);

const connectFourTokens: Record<string, string> = {
  "5-3": "bg-red-500",
  "4-3": "bg-yellow-400",
  "5-4": "bg-red-500",
  "5-2": "bg-yellow-400",
  "3-3": "bg-red-500",
  "4-4": "bg-yellow-400",
  "5-5": "bg-red-500",
};

const ConnectFourPreview = () => (
  <div className="grid grid-cols-7 gap-1 rounded-sm border border-slate-600 p-1.5">
    {Array.from({ length: 42 }, (_, index) => {
      const key = `${Math.floor(index / 7)}-${index % 7}`;
      return <span key={key} className={`h-3.5 w-3.5 rounded-full ${connectFourTokens[key] ?? "bg-slate-800"}`} />;
    })}
  </div>
);

const hangmanScreen = `  ______
  |    |
  O    |
 /|    |
       |
_ _ _ a _ _ _ e`;

const mastermindScreen = [
  { guess: "1234", hints: ["x", "x"], exact: 0 },
  { guess: "5566", hints: ["x", "x", "x"], exact: 1 },
  { guess: "6516", hints: ["x", "x", "x"], exact: 2 },
];

const MastermindPreview = () => (
  <div className="space-y-1.5 font-mono text-xs text-slate-200">
    {mastermindScreen.map(({ guess, hints, exact }) => (
      <p key={guess}>
        <span className="text-cyan-400">&gt; {guess}</span>{" "}
        {hints.map((hint, index) => (
          <span key={index} className={index < exact ? "text-red-500" : ""}>
            {hint}
          </span>
        ))}
      </p>
    ))}
  </div>
);

const previews: Record<string, () => React.JSX.Element> = {
  chess: ChessPreview,
  "connect-four": ConnectFourPreview,
  hangman: () => <pre className="font-mono text-xs leading-tight text-slate-200">{hangmanScreen}</pre>,
  mastermind: MastermindPreview,
};

const GamePreview = ({ slug }: { slug: string }) => {
  const Preview = previews[slug];

  return (
    <div className="flex h-40 items-center justify-center rounded-lg bg-[#020617]">
      {Preview && <Preview />}
    </div>
  );
};

export default GamePreview;
