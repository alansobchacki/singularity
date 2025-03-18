interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size: number;
  text: string;
}

const Button = ({ onClick, disabled, size, text }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-2 w-[${size}px] border p-2 rounded-lg text-white ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-400"
      }`}
    >
      {text}
    </button>
  );
};

export default Button;
