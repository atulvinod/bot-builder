import "./image-input.style.css";
import "react-image-crop/dist/ReactCrop.css";
import { v4 as uuidv4 } from "uuid";

import { Camera } from "lucide-react";
import {
    ChangeEvent,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from "react";
import { PercentCrop, PixelCrop, ReactCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { canvasPreview } from "./canvas-preview";
import { CustomModal } from "../custom-modal/custom-modal";

export const ImageInput = ({
    handleSetImage,
}: {
    handleSetImage: (f: File) => void;
}) => {
    const fileInputRef: MutableRefObject<HTMLInputElement | null> =
        useRef(null);
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
    const backgroundRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>();
    const imageRef = useRef(null);
    const [crop, setCrop] = useState<PercentCrop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState(4 / 4);

    const handleClick = () => {
        // 👇️ open file input box on click of another element
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        setSelectedImage(URL.createObjectURL(fileObj));
        setModalIsOpen(true);
        event.target.value = "";
    };

    const getCroppedImage = () => {
        if (
            !imageRef.current ||
            !canvasRef.current ||
            !completedCrop ||
            !backgroundRef.current
        ) {
            return;
        }
        canvasPreview(imageRef.current, canvasRef.current, completedCrop);
        canvasRef.current.toBlob((blob) => {
            if (!blob) {
                return;
            }
            const blobURL = URL.createObjectURL(blob);
            console.log(blobURL);
            backgroundRef.current!!.style.background = `url(${blobURL})`;
            const file = new File([blob], uuidv4(), { type: blob.type });
            if (handleSetImage) {
                handleSetImage(file);
                setModalIsOpen(false);
            }
        });
    };

    useEffect(() => {
        if (
            !imageRef.current ||
            !canvasRef.current ||
            !completedCrop ||
            !backgroundRef.current
        ) {
            return;
        }
        canvasPreview(imageRef.current, canvasRef.current, completedCrop);
        canvasRef.current.toBlob((blob) => {
            if (!blob) {
                return;
            }
            const blobURL = URL.createObjectURL(blob);
            console.log(blobURL);
            backgroundRef.current!!.style.background = `url(${blobURL})`;
        });
    }, [completedCrop]);

    return (
        <div>
            <div
                className="user-image-input-container shadow-lg border-2 "
                onClick={handleClick}
                ref={backgroundRef}
                style={{
                    backgroundSize: "contain",
                }}
            >
                <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png"
                />

                <Camera />
            </div>
            <CustomModal
                modalTitle={"Crop Image"}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
            >
                <div className="crop-content-container">
                    <ReactCrop
                        aspect={aspect}
                        crop={crop}
                        onChange={(_, c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        style={{
                            marginTop: "5rem",
                            flex: "1",
                        }}
                    >
                        <img
                            ref={imageRef}
                            src={selectedImage}
                            alt=""
                            className="cropped-image-preview"
                        />
                    </ReactCrop>
                    <div className="crop-preview-container">
                        <span>Preview Image</span>
                        <canvas ref={canvasRef} className="preview-canvas" />
                        <Button onClick={getCroppedImage} variant={"default"}>
                            {"Crop Image & Save"}
                        </Button>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
};
