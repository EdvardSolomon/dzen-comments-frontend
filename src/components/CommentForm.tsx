import { useForm, SubmitHandler } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { addComment } from "../store/comments.slice";
import { useRef, useState } from "react";
import FileInput from "./FileInput";
import Inputs from "../types/Inputs.type";
import Modal from "./Modal";
import FsLightbox from "fslightbox-react";

const allowedTags = ["a", "code", "i", "strong"];

const validateMessage = (message: string) => {
  const tagRegex = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
  let match;
  const openTags = [];

  while ((match = tagRegex.exec(message)) !== null) {
    const tagName = match[1].toLowerCase();
    if (!allowedTags.includes(tagName)) {
      return `Invalid tag: <${tagName}>`;
    }

    if (match[0][1] !== "/") {
      openTags.push(tagName);
    } else {
      if (openTags.length === 0 || openTags[openTags.length - 1] !== tagName) {
        return `Incorrect closing tag: <${tagName}>`;
      }
      openTags.pop();
    }
  }

  if (openTags.length > 0) {
    return `Not all tags are closed: <${openTags.join(", ")}>`;
  }

  return true;
};

interface CommentFormProps {
  parentId?: number | null;
  onSubmitSuccess?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  parentId = null,
  onSubmitSuccess,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<Inputs>({ mode: "onChange" });

  const [isModalOpen, setModalOpen] = useState(false);
  const [tagType, setTagType] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<Inputs | null>(null);
  const [toggler, setToggler] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const fileInputRef = useRef<any>(null);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setPreviewContent(null);

    const imageUrl = data.image?.[0] ? URL.createObjectURL(data.image[0]) : "";

    const newComment = {
      id: Date.now(),
      user_name: data.user_name,
      created_at: new Date().toISOString(),
      text: data.text,
      email: data.email,
      homepage: data.homepage,
      parent_id: parentId,
      image_url: imageUrl,
    };

    recaptchaRef.current?.reset();
    reset();
    fileInputRef.current?.resetFileInput();

    dispatch(addComment(newComment));

    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  const insertTag = (tag: string, value?: string) => {
    const textarea = document.querySelector(
      'textarea[name="text"]'
    ) as HTMLTextAreaElement;

    if (textarea) {
      const { selectionStart, selectionEnd } = textarea;
      const currentText = watch("text", "");

      const beforeSelection = currentText.substring(0, selectionStart);
      const selectedText = currentText.substring(selectionStart, selectionEnd);
      const afterSelection = currentText.substring(selectionEnd);

      let newText;

      if (value) {
        newText = `${beforeSelection}<${tag}${value}>${selectedText}</${tag}>${afterSelection}`;
      } else {
        newText = `${beforeSelection}<${tag}>${selectedText}</${tag}>${afterSelection}`;
      }

      setValue("text", newText);
    }
  };

  const handleModalSubmit = (data: {
    href?: string;
    title?: string;
    text: string;
  }) => {
    if (tagType === "a" && data.href && data.title) {
      const anchorTag = `<a href="${data.href}" title="${data.title}">${data.href}</a>`;
      insertTagDirect(anchorTag);
    } else if (tagType === "code" && data.text) {
      const codeTag = `<code>${data.text}</code>`;
      insertTagDirect(codeTag);
    }
    setModalOpen(false);
    trigger("text");
  };

  const insertTagDirect = (taggedText: string) => {
    const currentText = watch("text", "");
    const newText = `${currentText}${taggedText}`;
    setValue("text", newText);
  };

  const openModal = (type: string) => {
    setTagType(type);
    setModalOpen(true);
  };

  const onCaptchaChange = (token: string | null) => {
    setValue("captchaResponse", token, { shouldValidate: true });
    trigger("captchaResponse");
  };

  const handlePreview = () => {
    const previewData: Inputs = {
      user_name: watch("user_name"),
      email: watch("email"),
      homepage: watch("homepage"),
      text: watch("text"),
      image: watch("image"),
      captchaResponse: watch("captchaResponse"),
    };
    setPreviewContent(previewData);
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          tagType={tagType as string}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={"bg-gray-100 shadow-md rounded-lg p-6 mb-6"}
      >
        <div className='mb-4'>
          <input
            placeholder='Your Name'
            {...register("user_name", {
              required: true,
              pattern: /^[a-zA-Z0-9]*$/,
            })}
            className={`border p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.user_name
                ? "focus:border-red-500 border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.user_name && (
            <span className='text-red-500 text-sm mt-1'>
              {errors.user_name?.type === "required"
                ? "Username is required"
                : "Username is invalid"}
            </span>
          )}
        </div>

        <div className='mb-4'>
          <input
            placeholder='Email'
            type='email'
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            className={`border p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.email
                ? "focus:border-red-500 border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.email && (
            <span className='text-red-500 text-sm mt-1'>
              {errors.email?.type === "required"
                ? "Email is required"
                : "Email is invalid"}
            </span>
          )}
        </div>

        <div className='mb-4'>
          <input
            placeholder='Homepage'
            {...register("homepage", {
              pattern:
                /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}([\/\w .-?=&]*)*\/?$/,
            })}
            className={`border p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.homepage
                ? "focus:border-red-500 border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.homepage && (
            <span className='text-red-500 text-sm mt-1'>URL is invalid</span>
          )}
        </div>

        <div className='mb-1 flex space-x-2'>
          <button
            type='button'
            onClick={() => insertTag("i")}
            className='p-2 bg-gray-200 rounded hover:bg-blue-500 transition duration-200'
          >
            <i>i</i>
          </button>
          <button
            type='button'
            onClick={() => insertTag("strong")}
            className='p-2 bg-gray-200 rounded hover:bg-blue-500 transition duration-200'
          >
            <strong>strong</strong>
          </button>
          <button
            type='button'
            onClick={() => openModal("a")}
            className='p-2 bg-gray-200 rounded hover:bg-blue-500 transition duration-200'
          >
            <span>[a]</span>
          </button>
          <button
            type='button'
            onClick={() => openModal("code")}
            className='p-2 bg-gray-200 rounded hover:bg-blue-500 transition duration-200'
          >
            <code>code</code>
          </button>
        </div>

        <div className='mb-4'>
          <textarea
            defaultValue='Your comment'
            {...register("text", {
              required: true,
              validate: validateMessage,
            })}
            className={`border p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.text
                ? "focus:border-red-500 border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.text && (
            <span className='text-red-500 text-sm mt-1'>
              {errors.text?.type === "required" && "Comment is required"}
              {errors.text?.type === "validate" && "Incorrect HTML tags"}
            </span>
          )}
        </div>

        <div className='mb-4'>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_SITEKEY}
            onChange={onCaptchaChange}
          />
          <input
            type='hidden'
            {...register("captchaResponse", {
              required: "Please complete the CAPTCHA",
            })}
          />
          {errors.captchaResponse && (
            <span className='text-red-500 text-sm mt-1'>
              Please complete the CAPTCHA
            </span>
          )}
        </div>

        <div className='mb-4'>
          <FileInput
            setValue={setValue}
            trigger={trigger}
            ref={fileInputRef}
          />
        </div>

        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={handlePreview}
            disabled={!isValid}
            className='bg-blue-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed'
          >
            Preview
          </button>

          <button
            type='submit'
            disabled={!isValid}
            className='bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 w-full disabled:bg-gray-500 disabled:cursor-not-allowed'
          >
            Comment
          </button>
        </div>
      </form>

      {previewContent && (
        <div className='bg-white shadow-md rounded-lg p-4 mb-4 mt-6'>
          <div className='comment-header mb-2'>
            <strong className='text-blue-600'>
              {previewContent.user_name}
            </strong>
            <small className='text-gray-500 ml-2'>
              Date and time: [Preview]
            </small>
          </div>
          <div
            className='comment-body text-gray-800'
            dangerouslySetInnerHTML={{ __html: previewContent.text }}
          ></div>
          {previewContent.image && (
            <>
              <img
                src={URL.createObjectURL(previewContent.image[0])}
                alt='Comment Image'
                style={{ width: "150px", cursor: "pointer", marginTop: "10px" }}
                onClick={() => setToggler(!toggler)}
              />
              <FsLightbox
                toggler={toggler}
                sources={[URL.createObjectURL(previewContent.image[0])]}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CommentForm;
