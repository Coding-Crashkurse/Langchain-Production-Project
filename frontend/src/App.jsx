import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const App = () => {
  const [conversation, setConversation] = useState({ conversation: [] });
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConversation = async () => {
      const conversationId = localStorage.getItem("conversationId");
      if (conversationId) {
        const response = await fetch(
          `http://localhost:5000/service2/${conversationId}`
        );
        const data = await response.json();
        if (!data.error) {
          setConversation(data);
        }
      }
    };

    fetchConversation();
  }, []);

  const generateConversationId = () =>
    "_" + Math.random().toString(36).slice(2, 11);

  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleNewSession = () => {
    localStorage.removeItem("conversationId");
    setConversation({ conversation: [] });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let conversationId = localStorage.getItem("conversationId");
    if (!conversationId) {
      conversationId = generateConversationId();
      localStorage.setItem("conversationId", conversationId);
    }

    const newConversation = [
      ...conversation.conversation,
      { role: "user", content: userMessage },
    ];

    const response = await fetch(
      `http://localhost:5000/service2/${conversationId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: newConversation }),
      }
    );

    const data = await response.json();
    setConversation(data);
    setUserMessage("");
    setIsLoading(false);
  };

  return (
    <div
      className="App flex flex-col items-center pt-6 min-h-screen bg-gray-900 text-sm"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-3xl font-bold mb-4 text-white">Restaurant Chatbot</h1>
      {conversation.conversation.length > 0 && (
        <div className="flex flex-col p-4 bg-white rounded shadow w-full max-w-md space-y-4">
          {conversation.conversation
            .filter((message) => message.role !== "system")
            .map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <strong className="font-bold text-gray-900">
                  {message.role}:
                </strong>
                <span className="text-gray-700">{message.content}</span>
              </div>
            ))}
        </div>
      )}
      <div className="flex flex-row w-full max-w-md mt-4">
        <input
          type="text"
          value={userMessage}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-grow mr-2 p-2 rounded border-gray-300"
          placeholder={isLoading ? "Processing..." : "Type your message here"}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="p-2 rounded bg-blue-800 text-white"
        >
          Send
        </button>
      </div>
      {isLoading && (
        <div className="flex items-center space-x-4 text-l text-white">
          <FaSpinner className="animate-spin" />
          <span>Loading...</span>
        </div>
      )}
      <button
        onClick={handleNewSession}
        className="mt-4 p-2 rounded bg-red-700 text-white absolute top-0 left-4"
      >
        New Session
      </button>
    </div>
  );
};

export default App;
