import React from 'react';
import "../css/navBar.css";
import AddBookLink from "./AddBookLink";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import authService from '../services/authService';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //check if current route is on any of the pages
  const isSignInPage = location.pathname === "/signin";
  const isRegisterPage = location.pathname === "/register";
  const isCreateFormPage = location.pathname === "/createForm";

  const handleSignOut = (success, status, data) => {
    if (success) {
      console.log("User signed out successfully");
    } else {
    
      console.error("Error signing out");
    }
  };


  //console.log("Is Signed In:", authService.isSignedIn());
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
          id="bookNookContainer"
        >
          <span className="material-symbols-outlined">auto_stories</span>
          <strong>The Book Nook</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarsExample07"
          aria-controls="navbarsExample07"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample07">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" id="addBookLink">
              {!isCreateFormPage && !isSignInPage && !isRegisterPage && (
                <AddBookLink />
              )}
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            {authService.isSignedIn() &&
            location.pathname !== "/signin" &&
            location.pathname !== "/register" ? (
              <li className="nav-item dropdown dropDownEmail">
                <a
                  className="nav-link dropdown-toggle"
                  href="/#"
                  id="dropdown07"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {`Welcome ${authService.signedInEmail().split("@")[0]}! `}
                </a>
                <div className="dropdown-menu" aria-labelledby="dropdown07">
                  <Link
                    className="dropdown-item"
                    to="/signin"
                    onClick={() => authService.signOut(handleSignOut)}
                  >
                    Logout
                  </Link>
                </div>
              </li>
            ) : (
              <>
                {!location.pathname.includes("/signin") && (
                  <Link to="/signin" className="nav-link navLR" id="navSignin">
                    Sign In
                  </Link>
                )}
                {!location.pathname.includes("/register") && (
                  <Link
                    to="/register"
                    className="nav-link navLR"
                    id="navRegister"
                  >
                    Register
                  </Link>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="overlay"></div>
    </nav>
  );
}
  
export default NavBar;