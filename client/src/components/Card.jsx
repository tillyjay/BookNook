import React, { useState } from "react";
import AuthorModal from "./AuthorModal";
import axios from "axios";
import "../css/card.css";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

//props for this component:
//- book: array of book objects obtained from API call fetch with axios
//- onDelete function to update Main.jsx when button clicked
export default function Card({ book, onDelete }) {
  
  const navigate = useNavigate();

  //state to track selected book for displaying AuthorModal
  const [selectedBook, setSelectedBook] = useState(null);

  //handle click on author button, set selected book
  const handleAuthorClick = (book) => {
    setSelectedBook(book);
  };

  //handle closing AuthorModal
  const handleCloseModal = () => {
    setSelectedBook(null);
  };



  //ranking and id to be passed down as prop to editForm
  const ranking = book.ranking;
  const _id = book._id;

  //map and return instance of Card component, pass in prop data
  //Card component receives data from the 'books' prop
  return (
    <>
      <div className="col col-lg-4">
        <div className="card mb-4 box-shadow shadow p-3 mb-5">
          <div className="mainImg">
            <img
              className="card-img-top"
              data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
              alt="Thumbnail [100%x225]"
              style={{
                height: "auto",
                width: "50%",
              }}
              src={book.cover_image_url}
              data-holder-rendered="true"
            />
          </div>
          <div className="card-body">
            <h6 className="card-text ranking" id="cardRanking">
              Ranking: {book.ranking}
            </h6>
            <h5
              className={`card-text title ${
                book.title.length > 28 ? "longTitle" : ""
              }`}
            >
              {book.title}
            </h5>
            <button
              type="button"
              className="btn authButton"
              data-toggle="modal"
              data-target="#"
              onClick={() => handleAuthorClick(book)}
            >
              {book.author.first_name} {book.author.last_name}
            </button>
            
            <p className="blurbText">{book.blurb}</p>
            <div className="baseDiv">
              <div className="ratings">
                <small className="text-muted">Rating: {book.rating}</small>
                <small className="text-muted ratingNum">
                  Ratings: {book.number_of_ratings}
                </small>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <Link
                    to={`/editForm/${ranking}/${_id}`}
                    className="btn btn btn-sm "
                    id="editBtn"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    id="deleteBtn"
                    onClick={onDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AuthorModal
          showModal={selectedBook !== null}
          handleClose={handleCloseModal}
          book={selectedBook}
        />
      </div>
    </>
  );
}
