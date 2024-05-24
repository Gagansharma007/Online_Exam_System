import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const navigate = useNavigate();
    const [ currentUser , setCurrentUser ] = useState(undefined);
    const [ isLoaded, setIsLoaded] = useState(false);
    useEffect(()=>{
        const funct = async () => {
        if(!localStorage.getItem('online-exam-user')){
          navigate('/login');
        } else {
          const user = await JSON.parse(localStorage.getItem('online-exam-user'));
          setCurrentUser(user);
          setIsLoaded(true);
        }
      }
        funct();
      },[navigate]);
  return (
    <div>Homepage</div>
  )
}

export default Homepage;