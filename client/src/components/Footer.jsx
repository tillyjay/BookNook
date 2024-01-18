import React from 'react';
import '../css/footer.css';
import SocialIcons from './SocialIcons';
import { useLocation } from "react-router-dom";

const Footer = () => {

  const location = useLocation();

  //check if the current route is '/signin' or '/register'
  const isSignInOrRegister =
    location.pathname === "/signin" || location.pathname === "/register";

  //conditionally render Back to top link based on route
  const renderBackToTop = !isSignInOrRegister && (
    <p className="float-right topBtn">
      <a href="/#">Back to top</a>
    </p>
  );

  return (
    <footer className="text-muted footerMain">
      <div className="footerContainer">
        {renderBackToTop}
        <p className="copyLib"> Library &copy; Book Nook</p>
      </div>
      <SocialIcons />
    </footer>
  );
}
 
export default Footer;