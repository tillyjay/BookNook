import { useState, useEffect } from "react";
import "../css/createForm.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


const CreateForm = () => {
  //use navigate hook for redirect
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("Current Route:", window.location.pathname);
  // }, []);

  //destructuring functions from 'useForm' hook
  //managing form state and handling form submissions
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();

  //state to track cover image URL
  const [coverImageUrl, setCoverImageUrl] = useState("");
  //state to track author image URL
  const [authorImageUrl, setAuthorImageUrl] = useState("");
  //state to track max ranking
  const [maxRanking, setMaxRanking] = useState(0);
  //state to store server response
  const [serverMessage, setServerMessage] = useState(null);

  //fetches the max ranking value from
  const fetchMaxRanking = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/books/max-ranking`
      );
      //return max ranking response or 0
      return response.data.maxRanking || 0;
    } catch (error) {
      console.error("Error fetching max ranking: ", error);
      return 0;
    }
  };

  //hook to fetch max ranking value when component mounts
  //fetched value is set with useState
  useEffect(() => {
    fetchMaxRanking().then((max) => setMaxRanking(max));
    //effect runs only once indicated by empty dependecy array
  }, []);

  //triggered when form is submitted
  const sendData = handleSubmit(async (booksData) => {
    console.log(booksData);

    try {
      //parse fields to be numbers or floats
      //increment maxRanking by 1 to get next unique ranking
      booksData.ranking = maxRanking + 1;
      booksData.rating = parseFloat(booksData.rating);
      booksData.number_of_ratings = parseInt(booksData.number_of_ratings);

      //use axios to post the collected data to the API endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/books`,
        booksData,
        { withCredentials: true }
      );

      console.log(response);
      if (response.status === 201) {
        //redirect user to main page upon successful post
        navigate("/");
      }
    } catch (error) {
      console.error("Error Submitting: ", error);

  if (error.response && error.response.status === 409) {
    // Set the server message for duplicate title
    console.log("Duplicate title error:", error.response.data.serverMessage);
    setServerMessage(error.response.data.serverMessage);
  }
    }
  });


  //navigate to the main page when button clicked
  const handleCancelClick = () => {
    navigate("/");
  };

  //handle changes in cover image URL input
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
        <h1 className="h3 mb-3 text-center">Add a Book to the Nook</h1>

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
          value={maxRanking + 1}
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
          placeholder="Title"
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
          placeholder="Cover Image"
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
          placeholder="Summary"
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
          placeholder="Rating"
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
          placeholder="Number of Ratings"
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
          placeholder="First Name"
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
          placeholder="Last Name"
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
          placeholder="Author Image"
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
          placeholder="Author Profile"
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
            id="coverImage"
          />
        )}

        {authorImageUrl && (
          <img src={authorImageUrl} alt="Author" className="image-preview" />
        )}
      </div>
    </div>
  );
};

export default CreateForm;
