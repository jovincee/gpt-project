import React from 'react'
import Sidebar from './components/Sidebar'
import Credits from './pages/Credits'
import { Route, Routes, useLocation } from 'react-router-dom'
import Community from './pages/Community'
import ChatBox from './components/ChatBox'
import './assets/prism.css'
import Loading from './pages/Loading'
import {Toaster} from "react-hot-toast"
import Login from './pages/Login'
import { useAppContext } from './context/AppContext'

const App = () => {

  const {user} = useAppContext()

  const {pathname} = useLocation()

  if (pathname === '/loading') return <Loading />

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-text)",
          },
        }}
      />

      {user ? (
        <div className='h-screen dark:text-white'>

        <div className='flex h-full'>
          <Sidebar />

          {/**Main Content */}
          <div className="flex-1 relative">
          <Routes>
            <Route path='/loading' element={<Loading />}/>
            <Route path='/' element={<ChatBox />}/>
            <Route path='/credits' element={<Credits />}/>
            <Route path='/community' element={<Community />}/>
          </Routes>
          </div>
          
        </div>
      </div>



      ) : (
        <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
          <Login/>
        </div>




      )}



     
    </>
  )
}

export default App