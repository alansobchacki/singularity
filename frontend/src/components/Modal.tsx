import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div role="dialog" aria-modal="true" className="card relative w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted hover:bg-gray-200 dark:hover:bg-slate-800"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
