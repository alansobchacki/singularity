import { ReactNode, useEffect } from "react";

interface AlertProps {
  active: boolean;
  children?: ReactNode;
  positive?: boolean;
  duration?: number;
  onClose: () => void;
}

const Alert = ({ active, children, positive = true, duration = 3000, onClose }: AlertProps) => {
  useEffect(() => {
    if (active) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration, onClose]);

  return (
    <div 
      className={`fixed left-1/2 transform -translate-x-1/2
        w-[200px] p-4 border rounded-lg shadow-md
        z-50 transition-all duration-500 ease-in-out
        ${positive ? "bg-green-100 border-green-700 text-green-700" : "bg-red-100 border-red-700 text-red-700"}
        ${active ? "top-[45px]" : "top-[-75px]"}
      `}
    >
      {children}
    </div>
  );
};

export default Alert;
