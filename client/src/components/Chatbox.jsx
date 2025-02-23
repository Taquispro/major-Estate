import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Chatbox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const API_KEY = import.meta.env.VITE_CHATBOX; // Replace with your actual Gemini API key
  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(input);
      const responseText = result.response.text(); // Extract response

      const botMessage = { text: responseText, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {" "}
      {/* Ensures it's always on top */}
      {!open ? (
        <button
          className="rounded-full p-3 shadow-lg bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => setOpen(true)}
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden border border-gray-300">
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <span>Chat with AI</span>
            <button onClick={() => setOpen(false)}>
              <X className="text-white" />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === "user" ? "bg-blue-100" : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="ml-2 bg-blue-500 text-white p-2 rounded"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
