import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData, dummyChats } from "../assets/assets";
import { useState, useEffect, useContext } from "react";


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
    const [activeChatTitle, setActiveChatTitle] = useState(dummyChats[0].messages[0].content || " ");
    const [activeItem, setActiveItem] = useState("");
    
    


    const fetchUser = async () => {
        setUser()
    }

    /**
     * fetchUserChats fetches users chat to the back-end; requires an asynchronous call
     */
    const fetchUsersChats = async () => {
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])

        
    }


    //use effect for rendering user chats
    useEffect(() => {
        if(user){
            fetchUsersChats()
        }
        else{
            setChats([])
            setSelectedChat(dummyChats[0])      
        }
    }, [user])
    //use effect for fetching user info
    useEffect(()=>{
        fetchUser()
    },[])

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
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, darkMode, setDarkMode, activeItem, setActiveItem, activeChatTitle, setActiveChatTitle
    }        //value is of datatype object to store data
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)