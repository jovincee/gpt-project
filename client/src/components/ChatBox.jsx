import React, { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import { useAppContext } from '../context/AppContext'
import Message from './Message'
import { Send, ImageIcon, MessageSquare, ChevronDown, Image } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import TypingDots from "./TypingDots";
import toast from 'react-hot-toast';
import api from '../lib/api'
const ChatBox = () => {

  //use useRef hook to persist position of the last message so that the screen positions to the recent message
  const containerRef = useRef(null)



  //initialize app context and message state here:
  const { selectedChat, darkMode, setDarkMode, activeChatTitle, setActiveChatTitle, user, axios, token, setUser, fetchUsersChats } = useAppContext()

  //state variables for messages and loading:
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  // const [loading, setLoading] = useState(true)
  const [input, setInput] = useState("");
  const [activateDropdown, setActivateDropdown] = useState(false)
  const [mode, setMode] = useState(() => localStorage.getItem("chatMode") || "text");
  
  


  

  //useEffect for loading the selected chat; useEffect only rerenders when the variable selectedChat changes:
  useEffect(() => {
    if(selectedChat){

      setMessages(selectedChat.messages)

    }

  }, [selectedChat])

  useEffect(() => {
    localStorage.setItem("chatMode", mode);
  }, [mode]);

  useEffect(() => {

    setDarkMode((prev) => prev)

  }, [darkMode])

  useEffect(() => {
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",

      })
    }

  }, [messages])


  //handle form submission for prompts in the chatbox below the page
 const onSubmit = async (e) => {
  e.preventDefault();

  if (!user) return toast("Please login");

  const userPrompt = input.trim();
  if (!userPrompt) return;

  setLoading(true);
  setInput("");
  if (messages.length === 0) {
    setActiveChatTitle(userPrompt);
  }

  setMessages(prev => [
    ...prev,
    {
      role: "user",
      content: userPrompt,
      timestamp: Date.now(),
      isImage: false,
    },
  ]);
  




  try {
   // Send and save prompt to backend with its appropriate HTTP headers
    const { data } = await api.post(
      `/api/message/${mode}`,
      {
        chatId: selectedChat._id,
        prompt: userPrompt,
        isPublished,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (data.success) {
      setMessages(prev => [...prev, {...data.reply, isNew: true}]);     //append to the list of messages; set a temporary isNew flag to true
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to send message");
  } finally {
    setLoading(false);
    console.log(messages);
    
    await fetchUsersChats();
  }
};

  

  return (
    <div
      className={`flex flex-col flex-1 h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
    >
      {/**Chat Header Area */}
      <div className="
        sticky top-0 
        w-full 
        z-20 
        px-4 py-3 
        border-b 
        bg-white dark:bg-gray-900 
        border-gray-200 dark:border-gray-700
      "></div>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {activeChatTitle || "New Chat"}
      </h1>

      {/**Chat Messages Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {/**Check condition if selected message has existing conversations inside it */}
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>
              Ask me anything.
            </p>
          
          </div>

        )}

        {/**If message is not empty, then begin rendering the messages */}
        {messages && messages.map((message, i) => ( 
          <Message key={i} message={message} isLastMessage={i===messages.length-1}/>         
        ))}

      </div>

      {/**Loading  */}
      {
        loading && <div className="max-w-[10%] px-4 py-3 rounded-2xl bg-[#f9fafb] dark:bg-[#101828] text-gray-800 dark:text-gray-200">
          <TypingDots />
      </div>
      }

      {/**Show option when user  */}
      {mode === "image" && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
          <p className='text-xs'>Publish Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e)=>setIsPublished(e.target.isChecked)}/>


        </label>


      )}

 
      
      {/**Input Messages Area */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
      >
         {/* MODE SELECTOR DROPDOWN */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActivateDropdown((p) => !p)}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            {mode === "text"
              ? <MessageSquare size={16} /> 
              : <ImageIcon size={16} /> 
            }


            <ChevronDown size={16} className="opacity-60" />
          </button>

          <AnimatePresence>
            {activateDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-2 left-0 w-44 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50"
              >
                <button
                  onClick={() => {
                    setMode("text");
                    setActivateDropdown(false);
                  }}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    mode === "text"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <MessageSquare size={16} /> Answer Prompt
                </button>
                <button
                  onClick={() => {
                    setMode("image");
                    setActivateDropdown(false);
                  }}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    mode === "image"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <ImageIcon size={16} /> Generate Image
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <input
          type="text"
          placeholder="Type your prompt here..."
          className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-transparent focus:border-blue-400 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {/**Send button */}
        <button
          type="submit"
          className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
         
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
