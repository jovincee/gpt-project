import React from 'react'
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import moment from 'moment';
import Markdown from 'react-markdown';
import Prism from 'prismjs';
import ImageModal from '../Modals/ImageModal';
import { useRef } from 'react';

const TYPING_SPEED = 18; // ms per character

const Message = ({message, isLastMessage}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayedText, setDisplayedText] = useState(
  message.role === "assistant" && !message.isImage ? "" : message.content);
  const shouldType = message.role === "assistant" && message.isNew === true && !message.isImage && isLastMessage;

  const hasTypedRef = useRef(false);
  // Typing animation
  useEffect(() => {
    if (message.isImage) return; // No typing for images
    if (!shouldType) {
      setDisplayedText(message.content);      
      return;
    };

    let index = 0;
    hasTypedRef.current = true;

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + message.content[index]);
      index++;

      if (index >= message.content.length) {
        clearInterval(interval);
        message.isNew = false; // Reset isNew flag after typing
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [message.content, shouldType]);


  // Highlight code blocks AFTER typing finishes
  useEffect(() => {
    if (displayedText === message.content) {
      Prism.highlightAll();
    }
  }, [displayedText, message.content]);
  
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
            
             {!message.isImage && 
              <div className='text-sm dark:text-priamry reset-tw'>
                <Markdown>
                  {displayedText}
                </Markdown>
                {/* Cursor while typing */}
                {shouldType && displayedText.length < message.content.length && (
                  <span className="inline-block ml-1 animate-pulse">▋</span>
                )}

              </div>
             }
             {message.isImage && (
              <img 
                src={message.content}
                alt=""
                className="rounded-lg max-h-64 w-auto object-contain border border-gray-300 dark:border-gray-700 cursor-pointer"
                onClick={() => {
                  setSelectedImage(message.content)
                  
                  
                }}
              
              
              />
              
             )}
             
             {/**Show timestamp to user */}
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>

            </div>
            <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} isPublished={message.isPublished} />
    </motion.div>
  )
}

export default Message
