interface ButtonProps {
  onClick?: () => void;
  size: number;
  text: string;
}

const Button = ({ onClick, size, text }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`mt-2 w-[${size}px] border p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400`}
    >
      {text}
    </button>
  );
};

export default Button;
