import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { getGeminiResponse } from "../utils/gemini";

const GeminiPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I'm Gemini 2.0. Ask me anything about code, logic, or creative writing.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleAsk = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await getGeminiResponse(userMsg);
      setMessages((prev) => [...prev, { role: "bot", text: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Error: Quota exceeded or API issues.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Navbar */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Gemini Chat
          </h1>
        </div>
      </header>

      {/* Message Container */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-8"
      >
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md shrink-0 
                ${msg.role === "user" ? "bg-purple-600" : "bg-white border"}`}
              >
                {msg.role === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-purple-600" />
                )}
              </div>

              <div
                className={`p-5 rounded-2xl shadow-sm max-w-[85%] border transition-all
                ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-white border-gray-100"
                }`}
              >
                {/* Use 'prose' from Tailwind Typography for beautiful markdown */}
                <div
                  className={`prose prose-sm md:prose-base max-w-none ${
                    msg.role === "user" ? "prose-invert" : ""
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-200 border" />
              <div className="h-12 w-24 bg-gray-200 rounded-2xl" />
            </div>
          )}
        </div>
      </main>

      {/* Input Dock */}
      <footer className="p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto relative group">
          <textarea
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleAsk())
            }
            placeholder="Ask me anything..."
            className="w-full pl-5 pr-14 py-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all resize-none shadow-inner"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !input.trim()}
            className="absolute right-2 bottom-2 p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-md active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default GeminiPage;
