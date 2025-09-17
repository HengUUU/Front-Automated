import React, { useState } from "react";
import GreenBar from "../component/GreenBar";
import { useNavigate } from "react-router-dom";


// A simple Modal component for the pop-up message.
const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 max-w-sm text-center">
        <h3 className="text-lg font-bold mb-4">API Response</h3>
        <p className="text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-200 rounded-full px-4 py-2 font-bold hover:bg-gray-300 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function EntryPlatform() {
  const [formData, setFormData] = useState({
    token: "",
  });

  const navigate = useNavigate();

    // A state variable to hold the response message from the backend.
  const [message, setMessage] = useState("");

  // State to control the visibility of the modal.
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

const handleSubmit = async (e) => {
  e.preventDefault();

  const backendUrl = `http://localhost:8000/token-request?token=${formData.token}`; 



  console.log(formData.token);

  try {
      // Send the token to the backend using a GET request.
      // Note that GET requests do not have a request body.
      const res = await fetch(backendUrl, {
        method: "GET",
      });

      console.log("Response OBJ:", res);
      // Check if the request was successful.
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // console.log("Response Data:", res.json());
      
      const data = await res.json();
      // console.log("Parsed Data:", data);



      // Check if backend returned a valid token
      if (data.status === "success") {
          // Save token to localStorage
        localStorage.setItem("token", formData.token);
        // Redirect to /home
        navigate("/home");
      } else {
        // Show error message
        setMessage(data.message || "Invalid token");
        setShowModal(true);
      }
    

    } catch (error) {

      console.error("Error sending token to backend:", error);
      setMessage("Error: " + error.message);
      setShowModal(true);
    }

    
  };
    

    // Function to close the modal.
    const handleCloseModal = () => {
      setShowModal(false);
      setMessage(""); // Clear the message when closing
    };




  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      {/* Top green bar */}
      < GreenBar />
      

      {/* Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-96 mt-10">
        <div className="bg-green-100 rounded-t-xl -m-8 p-4 mb-4">
          <h2 className="text-xl font-bold text-green-800">REST API</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">


          <div>
            <label className="block text-sm font-medium">Token</label>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
              className="mt-1 w-full rounded-md bg-gray-200 p-2 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="block mx-auto bg-gray-200 rounded-full px-6 py-2 font-bold hover:bg-gray-300"
          >
            Send Token
          </button>
        </form>
      </div>
      {/* Conditionally render the Modal */}
      {showModal && <Modal message={message} onClose={handleCloseModal} />}
    </div>
  );
}
