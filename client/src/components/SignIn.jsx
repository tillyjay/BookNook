import { useState, useEffect } from "react";
import "../css/signin.css";
import { useForm } from "react-hook-form";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

//destructuring 'navigate' prop from 'react-router-dom' library
//allows navigation between pages, enabling redirection after login success
const SignIn = () => {
  //use navigate hook for redirect
  const navigate = useNavigate();

  //destructuring functions from 'useForm' hook
  //managing form state and handling form submissions
  const {
    register,
    handleSubmit,
    formState: { errors },
     setValue,
  } = useForm();

  //state to store server response
  const [serverMessage, setServerMessage] = useState(null);

  //function to handle form submission
  const sendCredentials = (signInData) => {
    console.log(signInData);

    //call signIn function from authService
    authService.signIn(signInData, (isSignInSuccessful, reason) => {
      if (isSignInSuccessful) {
        //redirect user to main.jsx upon successful sign in
        navigate("/");
      } else {
        console.log(reason);
        console.log("Login Failed");
        setServerMessage(reason.serverMessage);
      }
    });
  };

    // handle email and password changes
    const handleEmailChange = (e) => {
      setValue("email", e.target.value);
      setServerMessage(null);
    };

    const handlePasswordChange = (e) => {
      setValue("password", e.target.value);
      setServerMessage(null);
    };


  //email validation rules
  const emailValidationRules = {
    required: "Email is required.",
    pattern: {
      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: "Email format is invalid.",
    },
  };

  //password validation rules
  const passwordValidationRules = {
    required: "Password is required.",
    minLength: {
      value: 8,
      message: "Password must have at least 8 characters.",
    },
  };


  return (
    <form onSubmit={handleSubmit(sendCredentials)} className="form-signin">
      <h1 className="h3 mb-3 font-weight-normal text-center">Please sign in</h1>
      <label htmlFor="inputEmail" className="sr-only">
        Email address
      </label>
      <input
        {...register("email", emailValidationRules)}
        id="inputEmail"
        className={`form-control ${errors.email ? "is-invalid" : ""}`}
        placeholder="Email address"
        onChange={handleEmailChange}
      />
      {errors.email && (
        <div className="invalid-feedback">{errors.email.message}</div>
      )}

      <label htmlFor="inputPassword" className="sr-only">
        Password
      </label>
      <input
        {...register("password", passwordValidationRules)}
        type="password"
        id="inputPassword"
        className={`form-control ${errors.password ? "is-invalid" : ""}`}
        placeholder="Password"
        onChange={handlePasswordChange}
      />
      {errors.password && (
        <div className="invalid-feedback">{errors.password.message}</div>
      )}

      <button
        className="btn btn-lg btn-primary btn-block"
        id="signBtn"
        type="submit"
      >
        Sign in
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
  );
};

export default SignIn;
