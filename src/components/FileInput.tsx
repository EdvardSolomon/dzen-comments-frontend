import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { UseFormSetValue, UseFormTrigger } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import FsLightbox from "fslightbox-react";
import Inputs from "../types/Inputs.type";

const MAX_IMAGE_WIDTH = 320;
const MAX_IMAGE_HEIGHT = 240;
const MAX_TEXT_FILE_SIZE = 100 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

interface FileInputProps {
  setValue: UseFormSetValue<Inputs>;
  trigger: UseFormTrigger<Inputs>;
}

const FileInput = forwardRef(({ setValue, trigger }: FileInputProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      resetFileInput();
      return;
    }

    if (file.type === "text/plain") {
      if (file.size > MAX_TEXT_FILE_SIZE) {
        resetFileInput();
        setErrorMessage(
          "The text file size exceeds the allowed limit of 100KB."
        );
        return;
      }
      setValue("image", [file]);
      trigger("image");
      setErrorMessage(null);
      return;
    } else if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      try {
        Resizer.imageFileResizer(
          file,
          MAX_IMAGE_WIDTH,
          MAX_IMAGE_HEIGHT,
          file.type.split("/")[1].toUpperCase(),
          100,
          0,
          (resizedFile) => {
            const resizedFileAsFile = new File(
              [resizedFile as BlobPart],
              file.name,
              {
                type: file.type,
              }
            );
            setValue("image", [resizedFileAsFile]);
            trigger("image");

            const previewUrl = URL.createObjectURL(resizedFileAsFile);
            setPreviewUrl(previewUrl);
          },
          "blob"
        );
        setErrorMessage(null);
      } catch (err) {
        setErrorMessage("Error resizing the image.");
        console.error("Error resizing the image", err);
      }
    } else {
      resetFileInput();
      setErrorMessage(
        "Invalid file format. Allowed formats: JPG, PNG, GIF, TXT."
      );
    }
  };

  const resetFileInput = () => {
    setPreviewUrl(null);
    setValue("image", []);
    trigger("image");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useImperativeHandle(ref, () => ({
    resetFileInput,
  }));

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg, image/png, image/gif, text/plain'
        className='block'
        onChange={handleFileChange}
      />

      {imageUrl && (
        <div className='mt-2'>
          <div className='relative inline-block'>
            <img
              onClick={() => setIsOpen(!isOpen)}
              src={imageUrl}
              alt='Preview'
              className='max-w-full max-h-60 object-contain cursor-pointer border border-gray-300'
            />
          </div>
        </div>
      )}
      <FsLightbox
        toggler={isOpen}
        sources={[imageUrl as string]}
      />

      {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
    </>
  );
});

export default FileInput;
