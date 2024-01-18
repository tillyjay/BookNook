import React from "react";
import { Link } from "react-router-dom";
import "../css/addBook.css";

const AddBookLink = () => {

  return (
    <Link to={`/createForm`} className="btn addBtn" id="addBtn2">
      Add a Book to the Nook
    </Link>
  );
}

export default AddBookLink;