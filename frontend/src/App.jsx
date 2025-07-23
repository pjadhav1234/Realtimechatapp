
import { Routes,Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/profilePage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";
import {  useEffect } from "react";
import { Navigate } from "react-router-dom";


const App = () => {

const {authUser,checkAuth}=useAuthStore();
useEffect(()=>{
  checkAuth();
},[checkAuth]);
console.log(authUser);

// if (isCheckingAuth && !authUser)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="size-10 animate-spin" />
//       </div>
//     );

  return (
    <div >
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
