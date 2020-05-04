import React, {Component} from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {Link} from "react-router-dom";
import Book from "./Book";
import Filters from "./Filters";
import {Dropdown} from "react-bootstrap"
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import DropdownButton from "react-bootstrap/DropdownButton";

class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
            List: [],
            page: 0,
            pageSize: 3,
            totalPages: 0,
            authors: [],
            search: "",
            genres: [],
            sortBy: ""
        }
    }

    fetchBooks = (page = this.state.page,
                  size = this.state.pageSize,
                  authors = this.state.authors,
                  search = this.state.search,
                  genres = this.state.genres
                  ) => {
        axios.get(`http://localhost:8080/api/books?authors=${authors}&genres=${genres}&search=${search}&page=${page}&pageSize=${size}&sort=${this.state.sortBy}`)
            .then(response => {
                console.log(response);
                this.setState({ List: response.data.content,
                    page: response.data.pageable.pageNumber,
                    pageSize: response.data.pageable.pageSize,
                    totalPages: response.data.totalPages
                                    });
            })
            .catch(error => console.log(error.response))
    };

    componentDidMount() {
        this.fetchBooks(0);
    }

    onDeleteElement = (bookISBN) => {
        axios.delete(`http://localhost:8080/api/books/${bookISBN}`)
            .then(response => {
                console.log(response);
                this.setState({ List: this.state.List.filter(l => l.isbn !== bookISBN)});
                this.fetchBooks(0);
            })
            .catch(error => console.log(error.response));

    };

    onFilter = (authors, search, genres) => {
        this.setState({
            authors: authors,
            search: search,
            genres: genres
        }, function() {
            this.fetchBooks(0);
        });
        console.log("fleva filter");
    };

    sortBy = (e) => {
        this.setState({sortBy: e.target.name},
            function() {
            this.fetchBooks(0)
            });
    };

    handlePageClick = (pageChangedEvent) => {
        this.fetchBooks(pageChangedEvent.selected);
    };

    renderPaginate = () =>
        <ReactPaginate previousLabel={'← Previous'}
                       nextLabel={'Next →'}
                       breakLabel={<span className="gap">...</span>}
                       breakClassName={'break-me'}
                       pageCount={this.state.totalPages}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       pageClassName={'page-item'}
                       pageLinkClassName={'page-link btn'}
                       previousClassName={'page-item'}
                       nextClassName={'page-item'}
                       previousLinkClassName={'page-link btn'}
                       nextLinkClassName={'page-link btn btn-outline-secondary'}
                       forcePage={this.state.page}
                       onPageChange={this.handlePageClick}
                       containerClassName={'pagination justify-content-center'}
                       activeClassName={'active'}
                       activeLinkClassName={'active bg-secondary border-secondary'}
                       disabledClassName={"disabled"}
        />;

    render() {
        const newList = this.state.List.map(book =>
            <Book ISBN={book.isbn}
                  title={book.title}
                  publicationDate={book.publicationDate}
                  authorName={book.author}
                  review={book.review}
                  numberPages={book.numberPages}
                  genres={book.genres}
                  imageUrl={book.imageUrl}
                  key={book.isbn}
                  onDelete={this.onDeleteElement}
            />);
        return (
            <div className="container mt-4">
                <div className={"row"}>
                <div className={"col-md-3"}>
                    <Filters onFilter={this.onFilter}/>
                </div>
                <div className={"col-md-9"}>
                <div className="row m-0 mb-3 p-3" style={{backgroundColor: "whitesmoke"}}>
                    {   this.state.List.length > 0 ?
                        <div className={"text-right"} style={{flex: "auto"}}>
                            <ButtonToolbar style={{display: "inline-block"}}
                                           className={""}>
                                {['Secondary'].map(
                                    variant => (
                                        <DropdownButton
                                            title="Sort Books By"
                                            variant={variant.toLowerCase()}
                                            id={`dropdown-variants-${variant}`}
                                            key={variant}
                                        >
                                            <Dropdown.Item href=""
                                                           name={"title"}
                                                           onClick={this.sortBy}>
                                                Title
                                            </Dropdown.Item>
                                            <Dropdown.Item href=""
                                                           name={"numberPages"}
                                                           onClick={this.sortBy}>
                                                Number of Pages
                                            </Dropdown.Item>
                                            <Dropdown.Item href=""
                                                           name={"publicationDate"}
                                                           onClick={this.sortBy}>
                                                Publication Date
                                            </Dropdown.Item>
                                        </DropdownButton>
                                    ),
                                )}
                            </ButtonToolbar>
                            <Link to={"/books/new"}>
                                <button className="btn btn-outline-secondary ml-2">
                                    <span><strong>Add new book</strong></span>
                                </button>
                            </Link>
                            <div style={{width: "100%"}}>
                                {newList}
                                <div className={"mt-4"}>
                                    {this.renderPaginate()}
                                </div>
                            </div>
                        </div>

                        :
                        <div className={"row text-center m-2 justify-content-center"} style={{flex: "auto", width: "90%"}}>
                            <div className={"row"} style={{display: "block"}}>
                                <h3> The List of Books is empty</h3>
                            </div>
                            <br/>
                            <div className={"row text-right"} style={{display: "block", flex: "auto"}}>
                                <Link to={"/books/new"}>
                                    <button className="btn btn-outline-secondary">
                                        <span><strong>Add new book</strong></span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    }

                </div>
            </div>
            </div>
            </div>
        )
    }
}

export default Books