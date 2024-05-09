import React from "react";

const Modal = ({ children, isOpen, onClose }) => {
  const modalClasses = isOpen
    ? "fixed top-0 left-0 h-full w-full bg-black bg-opacity-70 flex items-center justify-center"
    : "hidden";

  return (
    <div className={modalClasses} onClick={onClose}>
      <div className="bg-white p-6 rounded-lg min-w-96 min-h-96">{children}</div>
    </div>
  );
};

export default Modal;
