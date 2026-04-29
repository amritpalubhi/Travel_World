import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! 👋 I'm your Travel Assistant. Ask me anything about tours, destinations, or travel tips!",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage = {
        text: data.reply || "Sorry, I couldn't process that. Try again!",
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Oops! Connection error. Please check your internet.",
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "🌍 Popular destinations",
    "💰 Budget tours",
    "🏖️ Beach vacations",
    "🏔️ Adventure trips",
  ];

  const handleQuickQuestion = (question) => {
    setInput(question.substring(2)); // Remove emoji
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`chatbot-fab ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <span className="chatbot-avatar">🤖</span>
              <div>
                <h4>Travel Assistant</h4>
                <span className="chatbot-status">● Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message bot">
                <div className="message-bubble loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="chatbot-quick-questions">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => handleQuickQuestion(q)} className="quick-btn">
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
