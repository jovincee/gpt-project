import React from 'react'
import { useEffect } from 'react';
import { motion } from "framer-motion";
import moment from 'moment';
import Markdown from 'react-markdown';
import Prism from 'prismjs';

const Message = ({key, message}) => {
  useEffect(()=>{
    Prism.highlightAll()
  }, [message.content])
  
  return (
    <motion.div
          
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
              }`}
            >
            
             {!message.isImage && <div className='text-sm dark:text-priamry reset-tw'><Markdown>{message.content}</Markdown></div>}
             {message.isImage && (
              <img 
                src={message.content}
                alt=""
                className="rounded-lg max-h-64 w-auto object-contain border border-gray-300 dark:border-gray-700"
              />
             )}
             
             {/**Show timestamp to user */}
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>

            </div>
    </motion.div>
  )
}

export default Message
