import axios from 'axios'; 

const axiosOptions = {
  validateStatus: function(status) {
    return true
  }, 
  withCredentials: true
};

class authService {

  async signIn(signInData, callback) {

    try {
      //use axios to post the collected credentials to the API endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/signin`,
        signInData,
        axiosOptions
      );

      console.log(response);

      //handle response status
      switch (response.status) {
        case 200: {
          //succesful login
          sessionStorage.setItem('signedIn', 'true')
          sessionStorage.setItem('userEmail', signInData.email)
          callback(true, response.status, response.data);

          break;
        }
        case 400:
        case 401:
        case 500: {
          sessionStorage.setItem("signedIn", "false");
          callback(false, response.data);
          break;
        }
      }
      
    } catch (error) {
      sessionStorage.setItem("signedIn", "false");
      callback(false);
      console.log(error);
      console.error("Error signing in: ", error);
    }
  }

  isSignedIn() {
  return (
    sessionStorage.getItem("signedIn") === "true" &&
    sessionStorage.getItem("userEmail") !== null
  );
  }

  signedInEmail() {
    return sessionStorage.getItem("userEmail");
  }

  async signOut(callback) {
      try {
      //use axios to post the collected credentials to the API endpoint
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/signout`, axiosOptions
      );

      console.log(response);

      //handle response status
      switch (response.status) {
        case 204: {
          //succesful signout
          sessionStorage.removeItem("signedIn");
          sessionStorage.removeItem("userEmail");
          callback(true, response.status, response.data);
          break;
        }
        default: {
          //handle other response statuses if needed
          callback(false, response.status, response.data);
          break;
        }
      }
    } catch (error) {
      callback(false, response.status, response.data);

      console.error("Error signing out: ", error);
    }
  }

  async register(registerData, callback) {

    try {
      //use axios to post the collected data to the API endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        registerData,
        axiosOptions
      );

      console.log(response);

      //handle response status 
      switch (response.status) {
        case 201: {
          //succesful register
          callback(true, response.status, response.data);
          break;
        }
        case 409:
        case 400:
        case 500: {
          callback(false, response.data);
          break;
        }
  
      }

    } catch (error) {

      callback(false, response.status, response.data)
      console.error("Error registering: ", error);
    }
  }

}

export default new authService();