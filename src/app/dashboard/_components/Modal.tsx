interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
  }
  
  export default function Modal({ children, onClose }: ModalProps) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 min-w-[400px] "
        onClick={onClose}
      >
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 bg-gray-700 text-gray-300 rounded-full p-2 hover:bg-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {children}
        </div>
      </div>
    );
  }