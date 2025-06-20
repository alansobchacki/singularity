import { ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size: number;
  content?: ReactNode;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  "data-cy"?: string;
}

const Button = ({
  onClick,
  disabled,
  size,
  content,
  "data-cy": dataCy,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: `${size}px` }}
      data-cy={dataCy}
      className={`border p-2 rounded-lg text-white ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-400"
      }`}
    >
      {content}
    </button>
  );
};

export default Button;
