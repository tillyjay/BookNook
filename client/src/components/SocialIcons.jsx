import React from "react";
import "../css/socialIcons.css";

const SocialIcons = () => {

  return (
    <div className="socialIcons">
      <a
        href="https://www.facebook.com/"
        target="_blank"
        rel="noreferrer"
        className="icon"
      >
        <i className="fa fa-facebook-square"></i>
      </a>
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noreferrer"
        className="icon"
      >
        <i className="fa fa-instagram"></i>
      </a>
      <a
        href="https://www.pinterest.com/"
        target="_blank"
        rel="noreferrer"
        className="icon"
      >
        <i className="fa fa-pinterest-square"></i>
      </a>
    </div>
  );

}

export default SocialIcons;