import React, {Component} from 'react'
import axios from "axios";
import HomeImage from "../images/home.png"
import BookCarousel from "./BookCarousel";
import Footer from "./Footer";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            home:true
            /*bookNumberPages: [],
            bookReviews: [],
            genres: [],
            numberBooks: []*/
        }
    }

    componentDidMount() {
        this.fetchBooks();
        //this.fetchGenres();
    }

    fetchBooks = () => {
        axios.get(`http://localhost:8080/api/books/allBooks`)
            .then(response => {
                console.log(response);
                console.log("response");
                this.setState({ books: response.data,
                });
                console.log(this.state.books);
            })
            .catch(error => console.log(error.response))
    };

    fetchGenres = () => {
        axios.get(`http://localhost:8080/api/genres`)
            .then(response => {
                console.log(response);
                this.setState({ genres: response.data.map(genre => genre.name)
                });
            })
            .catch(error => console.log(error.response))
    };

    render()
    {
        return (
            <div style={{textAlign: "left !important", fontSize: "1rem !important"}} className={"bg-light"}>
                <img src={HomeImage}
                     style={{width: "100%"}}
                     className={"mb-5"}
                     alt={""}
                />
                <div className={"m-auto w-75 pb-5"}>
                    <BookCarousel home={true}/>
                </div>
                <Footer/>
            </div>
        )
    };
}

export default Home;