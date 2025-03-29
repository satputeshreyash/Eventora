import { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import axios from "axios";

const AskBot = () => {
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);  // Store multiple responses
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;  // Prevent sending empty questions
    setLoading(true);
    
    try {
      const response = await axios.post('/api/bot/ask', { question });
      const newResponse = response.data.answer;
      
      // Append the new response to the list of previous responses
      setResponses(prevResponses => [...prevResponses, { question, answer: newResponse }]);
      setQuestion('');  // Clear the question input
    } catch (error) {
      console.error("Error asking the bot:", error);
      setResponses(prevResponses => [...prevResponses, { question, answer: 'An error occurred. Please try again later.' }]);
    }

    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setResponses([]);  // Clear the response history when the modal closes
  };

  return (
    <>
      {/* Ask Bot Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="fixed right-6 top-20 bg-teal-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-teal-600"
      >
        Ask Bot
      </button>

      {/* Modal for asking a question */}
      <Modal
        show={showModal}
        onClose={closeModal}  // Clear the modal on close
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Ask your question to the bot
            </h3>

            {/* Display previous responses */}
            <div className="max-h-40 overflow-y-auto bg-gray-100 p-3 mb-3 rounded-md shadow-inner">
              {responses.length > 0 ? (
                responses.map((item, index) => (
                  <div key={index} className="mb-2 text-left">
                    <strong>Q:</strong> {item.question}
                    <br />
                    <strong>A:</strong> {item.answer}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No questions asked yet.</p>
              )}
            </div>

            {/* Input to ask a new question */}
            <TextInput
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              required
            />
            
            <div className="flex justify-center gap-4 mt-5">
              <Button color="success" onClick={handleAskQuestion} disabled={loading}>
                {loading ? 'Asking...' : 'Ask'}
              </Button>
              <Button color="gray" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AskBot;
