import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import Footer from "./components/Footer";
import CreateForm from "./components/CreateForm";
import EditForm from "./components/EditForm";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import authService from "./services/authService";

const App = () => {

  // //set initial signedIn status to "false" in sessionStorage
  //sessionStorage.setItem("signedIn", "false");

    // Check if the page is being reloaded
    useEffect(() => {
      const handleBeforeUnload = (event) => {
        // Reset the values on page reload
        sessionStorage.setItem("signedIn", "false");
        sessionStorage.removeItem("userEmail");
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, []);

  return (
    <React.Fragment>
      <NavBar />
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/createForm" element={<CreateForm />} />
            <Route path="/editForm/:ranking/:_id" element={<EditForm />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default App;
