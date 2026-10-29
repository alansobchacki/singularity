import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-blue-500 text-white hover:bg-blue-400 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400",
  secondary:
    "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  ghost:
    "text-gray-600 hover:bg-gray-200 dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400",
};

export const buttonStyles = (variant: Variant = "primary") =>
  `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const Button = ({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${buttonStyles(variant)} ${className}`}
      {...props}
    />
  );
};

export default Button;
