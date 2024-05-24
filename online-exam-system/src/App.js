import Homepage  from './Pages/Homepage';
import { Route, Routes , BrowserRouter } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
