import { Typography, AppBar, Toolbar, IconButton, Button } from "@mui/material"
import { useNavigate , Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../Slices/userApiSlice";
import { logout } from "../Slices/authSlice";
const Header = () => {
    const userInfo  = useSelector(state=>state.auth.userInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ logoutapicall ] = useLogoutMutation();
    const logoutHandler = async ()=>{
        try{
            await logoutapicall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch(err){
            console.log(err);
        }
    }
    const handleHomeClick = ()=>{
        navigate('/');
    }
    
  return (
    <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleHomeClick}>
                    Online Test System
                </Typography>
                <IconButton color="inherit" sx={{ marginRight : '20px' }} onClick={handleHomeClick}>
                    <HomeIcon />
                </IconButton>
                {userInfo ? 
                <>
                <Button component={Link} to='/createtest' color='inherit' sx={{mr: 1}}>Create Test</Button>
                <Button component={Link} to="/allresults" color="inherit" sx={{mr : 1}}>Results</Button>
                <IconButton color="inherit" >
                    <Typography variant="body1" sx={{ marginRight : '20px' }}>{userInfo.username}</Typography>
                </IconButton>
                <Button color="inherit" onClick={logoutHandler}>
                    Logout
                </Button> </>
                : 
                <>
                 <Button component={Link} to="/login" color="inherit" sx={{ mr: 1 }}>
                 Login
                 </Button>
                 <Button component={Link} to="/register" color="inherit">
                 Register
                 </Button>
                </> 
                }
            </Toolbar>
        </AppBar>
  )
}

export default Header