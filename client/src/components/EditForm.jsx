import React from "react";
import "../css/editForm.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditForm = () => {
  //use navigate hook for redirect
  const navigate = useNavigate();

  //useParams to get nextRanking from URL
  const { _id } = useParams();

  //destructuring functions from 'useForm' hook
  //managing form state and handling form submissions
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm();

  //state to track cover image URL
  const [coverImageUrl, setCoverImageUrl] = useState("");

  //state to track author image URL
  const [authorImageUrl, setAuthorImageUrl] = useState("");

  //define state hook to store data
  const [placeholders, setPlaceholder] = useState({
    ranking: "",
    title: "",
    cover_image_url: "",
    blurb: "",
    rating: "",
    number_of_ratings: "",
    author: {
      first_name: "",
      last_name: "",
      image_url: "",
      profile: "",
    },
  });

  //define state hook to store server message
  const [serverMessage, setServerMessage] = useState(null);

  //make call to books to retrieve all data
  useEffect(() => {
    //create async function to handle API request
    const fetchData = async () => {
      try {
        //use axios to post the collected data to the API endpoint
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/books/${_id}`,
          { withCredentials: true }
        );

        //once request is successful, update state with received data
        setPlaceholder(response.data);

        //set initial form values using setValue
        Object.keys(response.data).forEach((key) => {
          setValue(key, response.data[key]);
        });
      } catch (error) {
        //if error, log to console
        console.log(error);
      }
    };

    //call async function to initiate API request
    //not allowed directly, defined in useEffect and called immediately
    fetchData();

    // add 'id' to the dependency array
  }, [setValue, _id]);

  //submit data with put request
  const sendData = handleSubmit(async (booksData) => {
    console.log(booksData);

    try {
      //parse fields to be numbers or floats
      booksData.ranking = parseInt(booksData.ranking);
      booksData.rating = parseFloat(booksData.rating);
      booksData.number_of_ratings = parseInt(booksData.number_of_ratings);

      //use axios to put the collected data to the API endpoint
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/books/${placeholders._id}`,
        booksData,
        { withCredentials: true }
      );

      console.log("Data successfully updated:", response.data);
      if (response.status === 200) {
        //redirect user to main page upon successful post
        navigate("/");
      }
    } catch (error) {
      console.error("Error Submitting: ", error);

      if (error.response && error.response.status === 409) {
        setServerMessage(error.response.data.serverMessage);
      }
    }
  });

  //navigate to the main page when button clicked
  const handleCancelClick = () => {
    navigate("/");
  };

  //handle changes in cover image URL input and validate
  const handleImageUrlChange = (e) => {
    setCoverImageUrl(e.target.value);
    //clear errors for cover image URL
    clearErrors("cover_image_url");
  };

  //handle changes in author image URL input
  const handleAuthorImageUrlChange = (e) => {
   setAuthorImageUrl(e.target.value);
   // clear errors for author image URL
   clearErrors("author.image_url");
  };

  //handle duplicate title change
  const handleTitleChange = (e) => {
    setValue("title", e.target.value);
    setServerMessage(null);
  };

  return (
    <div className="form-container">
      <form onSubmit={sendData} className="form-create">
        <h1 className="h3 mb-3" id="mobileUpTitle">
          <span className="updateMessage">Update</span>{" "}
          <div>{placeholders.title}</div>
        </h1>

        <h4 className="h4 mb-3 font-weight-normal">Book Profile</h4>

        <label htmlFor="inputRanking" className="sr-only">
          Ranking
        </label>
        <input
          {...register("ranking", {
            required: "Ranking is required.",
            min: { value: 1, message: "Ranking should be at least 1." },
            max: { value: 100, message: "Ranking should not exceed 100." },
          })}
          type="number"
          id="inputRanking"
          //if errors.ranking is truthy there is an error,will apply is-invalid
          className={`form-control ${errors.ranking ? "is-invalid" : ""}`}
          defaultValue={placeholders.ranking}
          readOnly
        />
        {errors.ranking && (
          //if invalid-feedback class render div with error message
          <div className="invalid-feedback">{errors.ranking.message}</div>
        )}

        <label htmlFor="inputTitle" className="sr-only">
          Title
        </label>
        <input
          {...register("title", {
            required: "Title is required.",
          })}
          id="inputTitle"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          defaultValue={placeholders.title}
          onChange={handleTitleChange}
        />
        {errors.title && (
          <div className="invalid-feedback">{errors.title.message}</div>
        )}

        <label htmlFor="inputCoverImage" className="sr-only">
          Cover Image
        </label>
        <input
          {...register("cover_image_url", {
            required: "Cover image of the book is required.",
            validate: {
              validImageFormat: (value) => {
                //validate if URL ends with '.jpg' or '.png'
                return (
                  value.toLowerCase().endsWith(".jpg") ||
                  value.toLowerCase().endsWith(".png") ||
                  "Invalid image format. Must be of type jpg or .png."
                );
              },
            },
          })}
          id="inputCoverImage"
          className={`form-control ${
            errors.cover_image_url ? "is-invalid" : ""
          }`}
          defaultValue={placeholders.cover_image_url}
          onChange={handleImageUrlChange}
        />
        {errors.cover_image_url && (
          <div className="invalid-feedback">
            {errors.cover_image_url.message}
          </div>
        )}

        <label htmlFor="inputBlurb" className="sr-only">
          Summary
        </label>
        <input
          {...register("blurb", {
            required: "Summary of the book is required.",
          })}
          id="inputBlurb"
          className={`form-control ${errors.blurb ? "is-invalid" : ""}`}
          defaultValue={placeholders.blurb}
        />
        {errors.blurb && (
          <div className="invalid-feedback">{errors.blurb.message}</div>
        )}

        <label htmlFor="inputRating" className="sr-only">
          Rating
        </label>
        <input
          {...register("rating", {
            required: "Rating is required.",
            min: { value: 1, message: "Rating should be at least 1." },
            max: { value: 5, message: "Rating should not exceed 5." },
          })}
          type="number"
          step="any"
          id="inputRating"
          className={`form-control ${errors.rating ? "is-invalid" : ""}`}
          defaultValue={placeholders.rating}
        />
        {errors.rating && (
          <div className="invalid-feedback">{errors.rating.message}</div>
        )}

        <label htmlFor="inputNumRatings" className="sr-only">
          Number of Ratings
        </label>
        <input
          {...register("number_of_ratings", {
            required: "Number of ratings is required.",
          })}
          type="number"
          id="inputNumRatings"
          className={`form-control ${
            errors.number_of_ratings ? "is-invalid" : ""
          }`}
          defaultValue={placeholders.number_of_ratings}
        />
        {errors.number_of_ratings && (
          <div className="invalid-feedback">
            {errors.number_of_ratings.message}
          </div>
        )}

        <h4 className="h4 mb-3 font-weight-normal">Author Profile</h4>

        <label htmlFor="inputFirstName" className="sr-only">
          First Name
        </label>
        <input
          {...register("author.first_name", {
            required: "Author's first name is required.",
          })}
          id="inputFirstName"
          className={`form-control ${
            errors.author?.first_name ? "is-invalid" : ""
          }`}
          defaultValue={placeholders.author.first_name}
        />
        {errors.author?.first_name && (
          <div className="invalid-feedback">
            {errors.author.first_name.message}
          </div>
        )}

        <label htmlFor="inputLastName" className="sr-only">
          Last Name
        </label>
        <input
          {...register("author.last_name", {
            required: "Author's last name is required.",
          })}
          id="inputLastName"
          className={`form-control ${
            errors.author?.last_name ? "is-invalid" : ""
          }`}
          defaultValue={placeholders.author.last_name}
        />
        {errors.author?.last_name && (
          <div className="invalid-feedback">
            {errors.author.last_name.message}
          </div>
        )}

        <label htmlFor="inputAuthorImage" className="sr-only">
          Author Image
        </label>
        <input
          {...register("author.image_url", {
            required: "Image of the author is required.",
            validate: {
              validImageFormat: (value) => {
                //validate if URL ends with '.jpg' or '.png'
                return (
                  value.toLowerCase().endsWith(".jpg") ||
                  value.toLowerCase().endsWith(".png") ||
                  "Invalid image format. Must be of type jpg or .png."
                );
              },
            },
          })}
          id="inputAuthorImage"
          className={`form-control ${
            errors.author?.image_url ? "is-invalid" : ""
          }`}
          defaultValue={placeholders.author.image_url}
          onChange={handleAuthorImageUrlChange}
        />
        {errors.author?.image_url && (
          <div className="invalid-feedback">
            {errors.author.image_url.message}
          </div>
        )}

        <label htmlFor="inputAuthorProfile" className="sr-only">
          Author Profile
        </label>
        <input
          {...register("author.profile", {
            required: "Author profile is required.",
            maxLength: {
              value: 450,
              message: "Profile should not exceed 450 characters.",
            },
          })}
          id="inputAuthorProfile"
          className={`form-control ${
            errors.author?.profile ? "is-invalid" : ""
          }`}
          defaultValue={placeholders.author.profile}
        />
        {errors.author?.profile && (
          <div className="invalid-feedback">
            {errors.author.profile.message}
          </div>
        )}

        <button type="submit" className="btn submitBtn">
          Submit
        </button>
        <button className="btn cancelBtn" onClick={handleCancelClick}>
          Cancel
        </button>

        {serverMessage && (
          <div
            className={
              "p-2 text-danger border border-danger serverMessage d-flex align-items-center"
            }
          >
            {serverMessage}
            <span className="exclamation-circle ml-1">
              <span className="text-danger">!</span>
            </span>
          </div>
        )}
      </form>

      <div className="imageContainer">
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt="Cover"
            className="cover-image-preview"
          />
        )}

        {authorImageUrl && (
          <img src={authorImageUrl} alt="Author" className="image-preview" />
        )}
      </div>
    </div>
  );
};

export default EditForm;
