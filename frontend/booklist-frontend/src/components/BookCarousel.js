import React, {Component} from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";

class BookCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            randomBooks: [],
            thisBookISBN: props.ISBN,
            booksByAuthor: props.booksByAuthor,
            authorId: props.authorId
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
                        randomBooks: this.state.books.filter(book => book.authorId == this.props.authorId)
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
                var newList = [];
                for (var i = 0; i < 3; i++) {
                    const index = Math.floor(Math.random() * Math.floor(this.state.books.length));
                    newList.push(this.state.books[index]);
                    var isbn = this.state.books[index].isbn;
                    this.setState({books: this.state.books.filter(book => book.isbn !== isbn)});
                }

                this.setState({randomBooks: newList})
            }
        }
    };

    render() {
        var newList = [];
        if(this.state.randomBooks.length > 0) {
            newList = this.state.randomBooks.map(book =>
                <Carousel.Item key={book.isbn}>
                    <img
                        className="d-block w-100"
                        src={book.imageUrl}
                        alt={book.title}
                        style={{width: "180px", height: "250px",
                            maxHeight: "250px", maxWidth: "180px", cursor: "pointer"}}
                        onClick={() =>{
                            window.location = `/books/${book.isbn}/details`;
                        }}
                    />
                </Carousel.Item>)
        }
        return(
            <Carousel>
                {newList}
            </Carousel>
        )
    }
}

export default BookCarousel