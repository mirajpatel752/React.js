import { useState } from "react";
import ReactDOM from "react-dom";
const Portal = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <>
      <button onClick={toggleModal}>Toggle Modal</button>
      Portal
      {showModal && (
        <ModalPortal>
          <ModalContent onClose={toggleModal} />
        </ModalPortal>
      )}
    </>
  );
};
export default Portal;

function ModalPortal({ children }) {
  const modalRoot = document.getElementById("modal-root");
  return ReactDOM.createPortal(children, modalRoot);
}

// Modal content component
function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => onClose()}>
          &times;
        </span>
        <h2>Modal Title</h2>
        <p>This is modal content.</p>
      </div>
    </div>
  );
}
