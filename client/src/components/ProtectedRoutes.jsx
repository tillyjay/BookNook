import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

const ProtectedRoutes = () => {

  return authService.isSignedIn() ? <Outlet /> : <Navigate to='/signin' />
  //when return false ? the url bumps user to sign in.

}

export default ProtectedRoutes;


