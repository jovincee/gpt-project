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
    const [activeChatTitle, setActiveChatTitle] = useState(dummyChats[0].messages[0].content || " ");
    const [activeItem, setActiveItem] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loadingUser, setLoadingUser] = useState(true);
    
    


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
        try{
            if(!user) return toast('Login to create a new chat')
            navigate('/')
            await axios.post('/api/chat/create', {headers: {Authorization: `Bearer ${token}`}})
            await fetchUsersChats()         //fetch users chats from the backend
        } catch (error){
            toast.error(error.message)
            return;
        }
    }

    /**
     * fetchUserChats fetches users chat to the back-end; requires an asynchronous call
     */
    const fetchUsersChats = async () => {
        try{
            const {data} = await axios.get('/api/chat/all', {headers: {Authorization: `Bearer ${token}`}})
            if (data.success){
                console.log("nice")
                setChats(data.chats)
                //if user has no chats, create a new chat
                if(data.chats.length === 0){
                    
                    await createNewChat();
                    return fetchUsersChats();
                }else{
                    setSelectedChat(data.chats[0])
                }
            } else {
                toast.error(data.message)
                return;
            }

        } catch (error){
            toast.error(error.message)
        }

        
    }


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
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, darkMode, setDarkMode, activeItem, setActiveItem, activeChatTitle, setActiveChatTitle, createNewChat, loadingUser, fetchUsersChats, token, setToken, axios
    }        //value is of datatype object to store data
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)