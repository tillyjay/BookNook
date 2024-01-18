import { useState } from "react";
import "../css/register.css";
import { useForm } from "react-hook-form";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom"; 


const Register = () => {
  //use navigate hook for redirect
  const navigate = useNavigate();

  //destructuring functions from 'useForm' hook
  //managing form state and handling form submissions
  //also displays error messages
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // state to store server response
  const [serverMessage, setServerMessage] = useState(null);

  //function to handle form submission
  const sendData = async (registerData) => {
    console.log(registerData);

    //call register function from authService
    authService.register(registerData, (registerSuccessful, reason) => {
      if (registerSuccessful) {
        //redirect user to main.jsx upon successful register
        navigate("/");
      } else {
        console.log(reason);
        console.log("Register Failed");
        setServerMessage(reason.serverMessage);
      }
    });
  };

  // handle email change
  const handleEmailChange = (e) => {
    setValue("email", e.target.value);
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
    maxLength: {
      value: 255,
      message: "Password should not exceed 255 characters.",
    },
    pattern: {
      value:
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
      message:
        "Password must contain at least 8 characters, one uppercase letter, one number, and one special character.",
    },
  };

  return (
    <form onSubmit={handleSubmit(sendData)} className="form-register">
      <h1 className="h3 mb-3 font-weight-normal text-center">
        Please register
      </h1>

      <label htmlFor="inputFirstName" className="sr-only">
        First Name
      </label>
      <input
        {...register("firstName", {
          required: "First name is required.",
          maxLength: {
            value: 100,
            message: "First name should not exceed 100 characters.",
          },
        })}
        id="inputFirstName"
        className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
        placeholder="First Name"
      />
      {errors.firstName && (
        <div className="invalid-feedback">{errors.firstName.message}</div>
      )}

      <label htmlFor="inputLastName" className="sr-only">
        Last Name
      </label>
      <input
        {...register("lastName", {
          required: "Last name is required.",
          maxLength: {
            value: 100,
            message: "Last name should not exceed 100 characters.",
          },
        })}
        id="inputLastName"
        className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
        placeholder="Last Name"
      />
      {errors.lastName && (
        <div className="invalid-feedback">{errors.lastName.message}</div>
      )}

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
      />
      {errors.password && (
        <div className="invalid-feedback">{errors.password.message}</div>
      )}

      <button
        className="btn btn-lg btn-primary btn-block"
        id="regBtn"
        type="submit"
      >
        Register
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
}


export default Register;