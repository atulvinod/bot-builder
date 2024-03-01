import "./custom-modal.style.css";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const CustomModal = ({
    modalTitle,
    modalIsOpen,
    setModalIsOpen,
    children,
    modalClasses,
    modalStyles,
}: {
    modalTitle: string;
    modalIsOpen: boolean;
    setModalIsOpen: (o: boolean) => void;
    children: React.ReactNode;
    modalClasses?: string;
    modalStyles?: Modal.Styles;
}) => {
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className={modalClasses}
            style={modalStyles}
        >
            <div className="modal-content">
                <div className="modal-controls">
                    <h1>{modalTitle}</h1>
                    <Button
                        onClick={() => setModalIsOpen(false)}
                        variant={"default"}
                    >
                        <X className="button-icon icon-color-white" />
                    </Button>
                </div>
                <div style={{ marginTop: "20px", flex: "1" }}>{children}</div>
            </div>
        </Modal>
    );
};
