import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData, dummyChats } from "../assets/assets";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;


/**
 * This file is required so that data can be passed on (user information) across the webpages.
 * A context is needed since client information is passed across different pages and components. 
 * -    Sidebar requires user's chat information between chatbots.
 * -    
 */

const AppContext = createContext()

export const AppContextProvider = ({ children })=>{

    //hooks 
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    //const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem("darkMode");
        return stored ? JSON.parse(stored) : false;
    });
    const [activeChatTitle, setActiveChatTitle] = useState(" ");
    const [activeItem, setActiveItem] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loadingUser, setLoadingUser] = useState(true);
    
    // delete chat:
    const deleteChat = async (e, chatId) => {
        try{
        console.log(`chatId: ${chatId}`);
        e.stopPropagation();
        const confirm = window.confirm("Are you sure you want to delete this chat?");
        if(!confirm) return Promise.reject("Deletion cancelled by user");
        const {data} = await axios.delete(`/api/chat/delete/${chatId}`, {headers: {Authorization: `Bearer ${token}`}})
        console.log(data);
        if(data.success){ 
            console.log("chat deleted")
            setChats(prev => prev.filter(chat => chat._id !== chatId));
            await fetchUsersChats();
            toast.success(data.message)
        }
        } catch(error) {
            toast.error(error.message)

        }
    }


    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/data", {headers: {Authorization: `Bearer ${token}`}})
            if(data.success){
                setUser(data.user)
            } else {
                toast.error(data.message)

            }
        }catch (error) {
            toast.error(error.message)
        } finally {
            setLoadingUser(false);
        }
    }

    /**
     * Function that creates new chat
     * 
     */
    const createNewChat = async () => {
        if (!user || !token) {
            toast.error("Login to create a new chat");
            return false;
        }

        try {
            await axios.post(
            '/api/chat/create',
            null, // ✅ IMPORTANT
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            toast.success("New chat created");

            return true; // ✅ signal success
        } catch (error) {
            if (error.response?.status === 401) {
            toast.error("Session expired. Please login again.");
            return false;
            }

            toast.error(error.message);
            return false;
        }
        };

    /**
     * fetchUserChats fetches users chat to the back-end; requires an asynchronous call
     */
 const fetchUsersChats = async () => {
  if (!user || !token) return;

  try {
    const { data } = await axios.get(
      '/api/chat/all',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!data?.success) {
      toast.error(data?.message || "Failed to fetch chats");
      return;
    }

    setChats(data.chats);
    
    if (activeChatTitle === " " && data.chats.length > 0) {
      setActiveChatTitle(data.chats[0].messages[0]?.content || " ");
    }

    if (data.chats.length > 0) {
      setSelectedChat(data.chats[0]);
      return;
    }

    // ✅ ONLY create once, no recursion
    const created = await createNewChat();
    if (!created) return;

    // ✅ ONE controlled refetch
    const refreshed = await axios.get(
      '/api/chat/all',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (refreshed.data?.success) {
      setChats(refreshed.data.chats);
      setSelectedChat(refreshed.data.chats[0] || null);
    }

  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      return;
    }

    toast.error(error.message);
  }
};

    //use effect for rendering user chats
    useEffect(() => {
        if(user){
            console.log("ok");
            fetchUsersChats()
        }
        else{
            setChats([])
            setSelectedChat(dummyChats[0])      
        }
    }, [user])
    //use effect for fetching user info
    useEffect(()=>{
        if(token){
            fetchUser()
        } else {
            setUser(null)
            setLoadingUser(false);
        }
        
    },[token])

    // 🧩 Keep dark mode in sync with <html> and localStorage
    useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    }, [darkMode]);

    const value = {
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, darkMode, setDarkMode, activeItem, setActiveItem, activeChatTitle, setActiveChatTitle, createNewChat, loadingUser, fetchUsersChats, token, setToken, axios, deleteChat
    }        //value is of datatype object to store data
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)