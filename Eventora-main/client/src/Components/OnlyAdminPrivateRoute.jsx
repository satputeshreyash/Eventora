import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
   
    const { currentUser } = useSelector((state) => state.user);
 
  return currentUser && currentUser.isAdmin ? 
         <Outlet/> : 
         <Navigate to='/sign-in' />
  
}//so if you don't log in then if you try to go to the dashboard , it will navigate you to sign-in page
//and if you are log in then it will go to the dashboard page using Outlet

export default OnlyAdminPrivateRoute