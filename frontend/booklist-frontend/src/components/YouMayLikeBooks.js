import React, {Component} from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import Book from "./Book";
import SuggestedBooks from "./SuggestedBooks";

class YouMayLikeBooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            randomBooks: [],
            thisBookISBN: props.ISBN,
            booksByAuthor: props.booksByAuthor,
            authorId: props.authorId,
            home: true
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:8080/api/books/allBooks`)
            .then(response => {
                console.log(response);
                this.setState({ books: response.data});
                if(!this.props.booksByAuthor) {
                    this.randomBooks();
                }
                else {
                    this.setState({
                        randomBooks: this.state.books.filter(book => book.authorId === this.props.authorId)
                    });
                }
            })
            .catch(error => console.log(error.response))
    }

    randomBooks = () => {
        if(this.state.books.length > 1) {
            this.setState({books: this.state.books.filter(book => book.isbn !== this.state.thisBookISBN)});
            if(this.state.books.length <= 3) {
                this.setState({randomBooks: this.state.books})
            }
            else if(this.state.books.length > 3) {
                const newList = [];
                for (let i = 0; i < 3; i++) {
                    const index = Math.floor(Math.random() * Math.floor(this.state.books.length));
                    newList.push(this.state.books[index]);
                    const isbn = this.state.books[index].isbn;
                    this.setState({books: this.state.books.filter(book => book.isbn !== isbn)});
                }

                this.setState({randomBooks: newList})
            }
        }
    };

    render() {
        const newList = this.state.randomBooks.map(book =>
            <SuggestedBooks ISBN={book.isbn}
                  title={book.title}
                  imageUrl={book.imageUrl}
                  key={book.isbn}
            />);

        return(
            <div>
            {newList}
            </div>
        )
    }
}

export default YouMayLikeBooks;