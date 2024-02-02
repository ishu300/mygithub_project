import logo from "./logo.svg";
import React , {createContext , useState} from "react";
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Createpost from "./components/Createpost";
import { LoginContext } from "./context/LoginContext";
import Modal from "./components/Modal";
import UserProfile from "./components/UserProfile";
import MyFollowingPost from "./components/MyFollowingPost";



function App() {
  const[userLogin , setUserLogin] = useState(false);
  const [modalOpen , setModalOpen] =useState(false)
    return (
    <BrowserRouter>
     <div className="App">
      <LoginContext.Provider value={{setUserLogin , setModalOpen}}>
      <Navbar login={userLogin} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route exact path="/Profile" element={<Profile />}></Route>
        <Route path="/createPost" element={<Createpost />}></Route>
        <Route path="/profile/:userid" element={<UserProfile />}></Route>
        <Route path="/followingpost" element={<MyFollowingPost />}></Route>
      </Routes>
      <ToastContainer theme="dark"/>
     { modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
      </LoginContext.Provider>
    
    </div>
    </BrowserRouter>
    
  );
}

export default App;
