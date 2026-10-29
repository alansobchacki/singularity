import Link from "next/link";
import { buttonStyles } from "../Button";

const JoinPrompt = () => {
  return (
    <div className="card flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="font-semibold">Want to join the conversation?</p>
        <p className="text-sm text-muted">
          Create an account to post, comment, like, and follow people.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href="/login" className={buttonStyles("secondary")}>
          Sign in
        </Link>
        <Link href="/signup" className={buttonStyles("primary")}>
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default JoinPrompt;
