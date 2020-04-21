import React, {Component} from 'react'
import MyScatterPlot from "./MyScatterPlot";
import axios from "axios";
import MyBarChart from "./MyBarChart";
import HomeImage from "../images/home.png"

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            bookNumberPages: [],
            bookReviews: [],
            genres: [],
            numberBooks: []
        }
    }

    componentDidMount() {
        this.fetchBooks();
        this.fetchGenres();
    }

    fetchBooks = () => {
        axios.get(`http://localhost:8080/api/books/allBooks`)
            .then(response => {
                console.log(response);
                this.setState({ books: response.data,
                    bookNumberPages: response.data.map(book => book.numberPages),
                    bookReviews: response.data.map(book => book.review)
                });
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

    render() {
        return (
            <div style={{textAlign: "left !important", fontSize: "1rem !important"}} className={"bg-light"}>
                <img src={HomeImage}
                     style={{width: "100%"}}
                     className={"mb-5"}
                />
                <div className={"my-5"}>
                    <MyBarChart
                        genres={this.state.genres}
                        books={this.state.books}
                    />
                </div>
                <div>{this.state.books}</div>
            </div>
        )
    };
};

export default Home;