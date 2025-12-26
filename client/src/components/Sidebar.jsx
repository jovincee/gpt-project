import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, MessageCircle, CircleUser, Moon, Sun, User, ChevronLeft, ChevronRight, Plus, Search, Image, Coins } from "lucide-react";
import SidebarItem from './SidebarItem';
import moment from 'moment';
import { nanoid } from "nanoid";




const Sidebar = () => {
  //this is the Sidebar component

  //initialize any state variables; some variables are retrieved from AppContext
  const {chats, setSelectedChat,  darkMode, setDarkMode, user, navigate, setActiveChatTitle, activeItem, setActiveItem,
    createNewChat, axios, setChats, fetchUsersChats, setToken
  } = useAppContext()
  const [search, setSearch] = useState('')  //initially set at empty string
  const [isExpanded, setIsExpanded] = useState(false);


  // Logout functionality:
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success('Logged out successfully');
  }

  
  //top sidebar items:
  const menuItems = [
  { icon: <Plus size={20} className="text-black dark:text-gray-500" />, id: 'newChat', text: "New Chat", caption: null, route: '/' },
  { icon: <User size={20} className="text-black dark:text-gray-500" />, id: nanoid(),  text: "Profile", caption: null, route: '/', clickAction: {} },
  ]

  //bottom sidebar items:
  const botMenuItems = [
    { icon: <CircleUser size={20} className="text-black dark:text-gray-500" />, id: "userPage",  text: `${user?.name}`, caption: null, clickAction:  () => {} },
    { icon: <Image size={20} className="text-black dark:text-gray-500" />, id: "community",  text: "Community Images", caption: null, route: '/community' },
    { icon: <LogOut size={20} className="text-black dark:text-gray-500" />, id: "logout",  text: "Logout", caption: null, route: '/' },
  ]

  //use effect for rendering user chats
  useEffect(() => {
      if(chats.length != 0){
        setActiveItem(chats[0]._id)
      }
    }, [chats]

  )
  
  
  return (
    
    <motion.div
      animate={{
        width: isExpanded ? 270 : 80, // animate width between collapsed/expanded


      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="flex flex-col bg-gray-200 dark:bg-gray-800 text-white shadow-lg"
    >
        {/* Header + Toggle */}
      <div className="flex justify-between items-center p-4">
        {isExpanded && <span className="font-bold text-black dark:text-gray-300 text-lg">Menu</span>}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
      <nav className="flex flex-col gap-2 mt-2">
      {/* Search Section */}
      <div
        className={`flex items-center mx-2 p-2 rounded-lg hover:bg-gray-800 transition-colors ${
          isExpanded ? "justify-start gap-2" : "justify-center"
        }`}
      >
       <div className="flex items-center justify-center w-6 h-6">
          <Search size={18} className="text-gray-400" />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.input
              key="search"
              type="text"
              placeholder="Search Chats"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 text-sm p-2 rounded w-full outline-none focus:ring-1 focus:ring-gray-500"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Items */}
      
        {menuItems.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            expanded={isExpanded}
            isChat={false}
            isActive={activeItem === item.id}

            clickAction={async () => {
              console.log("clicked");
          
              navigate(item.route);
              if (item.id === 'newChat') {

                await createNewChat();
                await fetchUsersChats();

                return;
              }

            }}
          />
        ))}
    
          
        {/** Sidebar Chat items (on expanded) */}
    {chats.length > 0 && isExpanded && (
      <p className="mt-4 text-center font-bold text-sm text-black dark:text-white">
        Recent Chats
      </p>
    )}

    {chats
      .filter((chat) => {
        const searchTerm = search.toLowerCase();

        // Use first message content if it exists
        if (chat.messages?.length > 0 && chat.messages[0]?.content) {
          return chat.messages[0].content
            .toLowerCase()
            .includes(searchTerm);
        }

        // Fallback label for empty chats
        return "new chat".includes(searchTerm);
      })
      .map((chat) => {
        const hasMessages = chat.messages?.length > 0;
        const firstMessage = hasMessages ? chat.messages[0].content : null;

        return (
          <SidebarItem
            key={chat._id}
            chatId={chat._id}
            icon={<MessageCircle size={20} className="text-black dark:text-gray-500" />}
            text={hasMessages ? firstMessage.slice(0, 32) : "New Chat"}
            caption={moment(chat.updatedAt).fromNow()}
            expanded={isExpanded}
            isChat={true}
            isActive={activeItem === chat._id}
            clickAction={() => {
              navigate('/');
              setSelectedChat(chat);
              setActiveItem(chat._id);
              setActiveChatTitle(hasMessages ? firstMessage : "New Chat");
            }}
          />
        );
      })}

      {/**Bottom Section must be anchored at the very bottom */}
      <div className="flex flex-col absolute bottom-30 left-0 gap-1 mb-4">
        {botMenuItems.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            expanded={isExpanded}
            isChat={false}
            isActive={activeItem === item.id}
            clickAction={() => {
              navigate(item.route);
              if(item.id === "logout"){
                logout(); 
                return;
              }
              setActiveItem(item.id);
            }}
          />
        ))}
        



      </div>
      



      {/* Dark Mode Toggle */}
      <div
        className={`absolute bottom-0 left-0 flex items-center gap-3 mt-auto mb-4 mx-3 p-2 rounded-lg cursor-pointer transition-colors duration-300 ${
          darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
        }`}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} className="text-gray-500" />
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap"
            >
              <p className="text-black dark:text-gray-500">{darkMode ? "Light Mode" : "Dark Mode"}</p>
            </motion.span>
            
          )}
          
        </AnimatePresence>
      </div>

      </nav>
    </motion.div>
     
  )
}

export default Sidebar
