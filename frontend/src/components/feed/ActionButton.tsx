import { ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const ActionButton = ({ active, className = "", ...props }: ActionButtonProps) => {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm transition hover:bg-gray-200 disabled:cursor-default disabled:hover:bg-transparent dark:hover:bg-slate-800 ${
        active
          ? "text-blue-500 dark:text-emerald-400"
          : "text-gray-600 dark:text-slate-400"
      } ${className}`}
      {...props}
    />
  );
};

export default ActionButton;
