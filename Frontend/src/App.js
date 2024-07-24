import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Header from './Components/Header';
import Homepage from './Pages/Homepage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import TestList from './Components/TestList';
import CreateTest from './Pages/CreateTest';
import Test from './Pages/Test';
import SuccessPage from './Pages/SuccessPage';
import Result from './Pages/Result';
import { UserProvider } from './Components/UserContext';
import AllResults from './Pages/AllResults';
import ViewTest from './Pages/ViewTest';

axios.defaults.withCredentials = true;

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
      <div>
      <ToastContainer />
      <Header />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/starttest/:id' element={<Test />} />
          <Route path='/createtest' element={<CreateTest />} />
          <Route path="/test/:subject" element={<TestList />} />
          <Route path='/success' element={<SuccessPage />} />
          <Route path="/result/:testId" element={<Result />} />
          <Route path='/allresults' element={<AllResults /> } />
          <Route path="/viewtest/:resultId" element={<ViewTest/>} />
        </Routes>
      </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;