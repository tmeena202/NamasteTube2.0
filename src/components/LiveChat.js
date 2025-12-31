import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../utils/chatSlice";
import { generateRandomName, makeRandomMessage } from "../utils/helper";

const LiveChat = () => {
  const [liveMessage, setLiveMessage] = useState("");
  const dispatch = useDispatch();

  const chatMessages = useSelector((store) => store.chat.messages);

  useEffect(() => {
    const i = setInterval(() => {
      dispatch(
        addMessage({
          name: generateRandomName(),
          message: makeRandomMessage(20) + " 🚀",
        })
      );
    }, 700);

    return () => clearInterval(i);
  }, [dispatch]);

  return (
    <>
      {/* CHAT BOX */}
      <div className="h-[350px]  p-1 border border-gray-300 rounded-xl overflow-y-scroll flex flex-col-reverse bg-gray-50 shadow-inner">
        {chatMessages.map((c, index) => (
          <ChatMessage key={index} name={c.name} message={c.message} />
        ))}
      </div>

      {/* INPUT BOX */}
      <form
        className="w-full p-3 mt-2 border border-gray-300 rounded-xl flex items-center gap-3 bg-white shadow-md"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(
            addMessage({
              name: "tushar meena",
              message: liveMessage,
            })
          );
          setLiveMessage("");
        }}
      >
        <input
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={liveMessage}
          onChange={(e) => setLiveMessage(e.target.value)}
        />

        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Send
        </button>
      </form>
    </>
  );
};

export default LiveChat;
