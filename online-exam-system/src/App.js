import Homepage  from './Pages/Homepage';
import { Route, Routes , BrowserRouter } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import axios from 'axios';
import TestList from './Components/TestList';
import CreateTest from './Pages/CreateTest';
import Test from './Pages/Test';
import SuccessPage from './Pages/SuccessPage';
import Result from './Pages/Result';
axios.defaults.withCredentials = true;
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/starttest/:id' element={<Test/>} />
      <Route path='/createtest' element={<CreateTest />}/>
      <Route path="/test/:subject" element={<TestList/>} />
      <Route path='/success' element={<SuccessPage/>} />
      <Route path="/result/:testId" element={<Result />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
