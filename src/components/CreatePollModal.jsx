import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import { createPoll } from "../services/pollService";

function CreatePollModal({ closeModal, handleAddPoll }) {
  const [options, setOptions] = useState([""]);
  const [question, setQuestion] = useState("");

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    try {
      if (!question.trim()) {
        toast.error("Please add a question!");
        return;
      }
      if (options.length < 2 || options.some((option) => !option.trim())) {
        toast.error("Please add at least two valid options.");
        return;
      }
      const uniqueOptions = new Set(options.map((option) => option.trim()));
      if (uniqueOptions.size !== options.length) {
        toast.error("Options should be unique.");
        return;
      }
      const response = await createPoll(question, options);
      if (response.status === 200) {
        toast.success(response.data.message, { theme: "colored" });
        handleAddPoll(response.data.poll);
        closeModal();
      }
    } catch (error) {
      toast.error(error.message, { theme: "colored" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 h-[70vh] w-full max-w-md flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-bold mb-4">Create Poll</h1>

          <div className="mb-4">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Question
            </label>
            <input
              type="text"
              id="question"
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="options"
                className="block text-sm font-medium text-gray-700"
              >
                Options
              </label>
              <button
                onClick={handleAddOption}
                className={`text-2xl font-bold ${
                  options.length === 5 ? "text-gray-400" : "text-purple-600"
                } cursor-pointer`}
                disabled={options.length === 5}
              >
                +
              </button>
            </div>

            {options.map((option, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={option}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePoll}
            className="bg-purple-600 text-white rounded-md px-4 py-2 hover:bg-purple-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

CreatePollModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleAddPoll: PropTypes.func.isRequired,
};

export default CreatePollModal;
