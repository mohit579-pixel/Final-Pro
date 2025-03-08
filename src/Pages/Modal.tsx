import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  date: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, date }) => {
  const [content, setContent] = React.useState("");

  const handleSave = () => {
    onSave(content);
    setContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center text-black bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Content for {date}</h2>
        <textarea
          className="w-full p-2 border rounded-lg"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;