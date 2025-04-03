import { ReactNode } from "react";

interface AlertProps {
  active: boolean;
  children?: ReactNode;
  positive?: boolean;
}

const Alert = ({ active, children, positive = true }: AlertProps) => {
  return (
    <>
      <style jsx>{`
        @keyframes slideDownAndUp {
          0% {
            transform: translate(-50%, -75px);
          }
          10% {
            transform: translate(-50%, 15px);
          }
          90% {
            transform: translate(-50%, 15px);
          }
          100% {
            transform: translate(-50%, -75px);
          }
        }
        .animate-slideDownAndUp {
          animation: slideDownAndUp 3s ease-in-out forwards;
        }
      `}</style>

      <div
        className={`fixed left-1/2 top-0
          w-[200px] p-4 rounded-lg shadow-md z-50
          ${positive ? 
            "bg-green-100 border-green-300 text-green-700" : 
            "bg-red-100 border-red-300 text-red-700"
          }
          ${active ? "animate-slideDownAndUp" : "opacity-0"}
          border
        `}
      >
        {children}
      </div>
    </>
  );
};

export default Alert;