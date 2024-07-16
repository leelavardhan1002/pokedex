function Modal({
  isOpen,
  onClose,
  children,
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 lg:hidden">
      <div className="bg-white rounded-lg p-8 relative h-[80vh] w-11/12 max-w-lg overflow-auto">
        <h1 className="text-2xl font-bold text-SECONDARY border-b-[1.5px] border-SECONDARY w-full">
          Filters
        </h1>
        <button
          onClick={onClose}
          className="absolute top-6 right-8 rounded-full border-[1px] border-SECONDARY w-8 h-8 text-xl font-bold text-SECONDARY"
          data-testid="modal-close-button"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
