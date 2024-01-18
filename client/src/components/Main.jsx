import { useState, useEffect } from "react";
import "../css/main.css";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import Card from "./Card";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";


const Main = () => {
  const navigate = useNavigate();

  //define state hook to store data
  const [books, setBooks] = useState([]);
  //set cookies for jwt
  const [cookies, setCookie] = useCookies(["jwt"]);
  //set search query
  const [searchQuery, setSearchQuery] = useState("");
  //set state to store filtered books
  // Define state to store filtered books
  const [filteredBooks, setFilteredBooks] = useState([]);

  //make an initial call to books api to retrieve all data
  useEffect(() => {
    //create async function to handle API request
    const fetchData = async () => {
      try {
        axios.defaults.withCredentials = true;
        //use await to wait for API request to complete
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/books`
        );

        //organize books data into arrays of 3
        const booksArr = structureBooks( response.data );

        //search function
        //create new array by mapping over each row of books
        const updatedFilteredBooks = structureBooks(booksArr
          .flat()
          //for each book in current row, filter based on query
          .filter(
            (book) =>
              //check if search query matches any of criteria
              String(book.ranking).includes(searchQuery) ||
              book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.author.first_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              book.author.last_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              String(book.rating).includes(searchQuery)
          ));
    
        //update 'filteredBooks' state with filtered arr
        setFilteredBooks(updatedFilteredBooks);
        //update state with API response data
        setBooks(booksArr);
      } catch (error) {
        //if error, log to console
        console.log(error);
      }
    };

    //call async function to initiate API request when component mounts
    //not allowed directly, defined in useEffect and called immediately
    fetchData();

    //empty dependency array ensures effect runs only once when component mounts
  }, [searchQuery]);

  //function to structure books into arrays of 3
  const structureBooks = (books) => {

    return books.reduce((acc, book, index) => {
      //check if current index is a multiple of 6 (0-based index)
      if (index % 6 === 0) {
        //create a new array to hold current set of 3 books
        acc.push([book]);
      } else {
        //add current book to last sub-array in result
        acc[acc.length - 1].push(book);
      }

      return acc;
    }, []);
  }

  //function to handle delete request
  const handleDelete = async (bookId) => {

    //check if user is logged in before allowing deletion
    if (authService.isSignedIn()) {
      try {
        //delete request endpoint
        await axios.delete(`${import.meta.env.VITE_API_URL}/books/${bookId}`);

        //update state by removing deleted book
        const updatedBooks =structureBooks(books
          .flat()
          .filter((book) => book._id !== bookId))
      
        //update 'filteredBooks' state with filtered arr
        setFilteredBooks(updatedBooks);
        setBooks(updatedBooks);

      } catch (error) {
        console.error("Error deleting book:", error);
      }
    } else {
      //redirect to sign-in if not logged in
      console.log("User not logged in. Redirect to sign-in.");
      //navigate to signin
      navigate("/signin");
    }
  };

  //using bootstrap for styling
  return (
    <div>
      <section className="jumbotron text-center">
        <div className="container">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="searchBar"
              placeholder="Search this site"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="input-group-append searchBtn">
              <button className="btn btn-secondary" type="button">
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Link redirect to CreateForm component
        map function to iterate over each array of books (bookArr)
        each array represents a row of books, with a max of 3 books per row
        map function again to iterate over each book in current row
        render Card component for each book in row
      */}
      <div className="album py-5 bg-light">
        <div className="container">
          {filteredBooks.map((bookArr, index) => {
            return (
              <div key={index} className="row">
                {bookArr.map((book) => {
                  //changed key from book.ranking to book._id
                  return (
                    <Card
                      key={book._id}
                      book={book}
                      onDelete={() => handleDelete(book._id)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
