import { useState } from "react";

interface ModalProps {
  tagType: string;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ tagType, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({ href: "", title: "", text: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-lg font-semibold mb-4'>
          {tagType === "a" ? "Insert Link" : "Insert Code"}
        </h2>
        <div className='space-y-4'>
          {tagType === "a" && (
            <>
              <input
                type='text'
                name='href'
                placeholder='Enter URL'
                value={formData.href}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
              <input
                type='text'
                name='title'
                placeholder='Enter Title'
                value={formData.title}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </>
          )}
          <input
            type='text'
            name='text'
            placeholder='Enter Text'
            value={formData.text}
            onChange={handleInputChange}
            className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
        </div>
        <div className='mt-6 flex justify-end space-x-4'>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200'
          >
            Insert
          </button>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
