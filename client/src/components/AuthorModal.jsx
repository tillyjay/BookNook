import React from "react";
import "../css/authorModal.css";

const AuthorModal = ({ showModal, handleClose, book }) => {
  

  //check if 'book' is available before trying to access 'author' properties
  const author = book?.author || {};
  
  return (
    <>
     {showModal && <div className="modal-overlay" />}
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      id="authorModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="authorModalTitle"
      aria-hidden="true"
      style={{ display: showModal ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="modal-title"
              id="authorModalTitle"
            >{`${author.first_name} ${author.last_name}`}</h2>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <img
              className="img-fluid"
              src={author.image_url}
              alt={`${author.first_name} ${author.last_name}`}
            />
            <p>{author.profile}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary modal-close"
              data-dismiss="modal"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AuthorModal;
