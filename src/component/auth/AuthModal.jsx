import { createPortal } from "react-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthModal = ({ view, onClose, onSwitchView }) => {
  return createPortal(
    <div className="fixed inset-0 z-50">
      {view === "login" ? (
        <LoginForm 
          onClose={onClose} 
          switchView={() => onSwitchView("signup")} 
        />
      ) : (
        <SignupForm 
          onClose={onClose} 
          switchView={() => onSwitchView("login")} 
        />
      )}
    </div>,
    document.body
  );
};

export default AuthModal;