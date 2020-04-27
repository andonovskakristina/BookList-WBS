import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import backgroundImage from "../images/createNewBackground.jpg";
import SingleSelect from "./SingleSelect";
import MultipleSelect from "./MultipleSelect";
import DatePickerr from "./DatePicker";
import PageNotFound from "./PageNotFound";

class EditBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ISBN: this.props.match.params.ISBN,
            title: "",
            publicationDate: "",
            author: 0,
            numberPages: 0,
            imageUrl: "",
            genres: "",
            description: "",
            oldState: {},
            authorOptions: [],
            genreOptions: [],
            notFound: false,
            selectedGenres: []
        }
    };

    componentDidMount() {
        axios.get(`http://localhost:8080/api/books/${this.state.ISBN}`)
            .then(response => {
                console.log(response);
                this.setState({
                    title: response.data.title,
                    publicationDate: response.data.publicationDate,
                    author: response.data.author,
                    authorName: response.data.authorName,
                    numberPages: response.data.numberPages,
                    imageUrl: response.data.imageUrl,
                    genres: response.data.genres,
                    description: response.data.description,
                    selectedGenres: response.data.genres.split(',').map((name) => ({
                        label: name,
                        value: name
                    })),
                    notFound: false,
                    oldState: {
                        "ISBN": this.state.ISBN,
                        "title": response.data.title,
                        "publicationDate": response.data.publicationDate,
                        "author": response.data.author,
                        "authorName": response.data.authorName,
                        "numberPages": response.data.numberPages,
                        "imageUrl": response.data.imageUrl,
                        "genres": response.data.genres,
                        "description": response.data.description
                    }
                })
            })
            .catch(error => {
                console.log(error);
                this.setState({notFound: true});
            });

        axios.get("http://localhost:8080/api/books/allAuthors")
            .then(response => {
                this.setState({authorOptions: response.data});
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });

        axios.get("http://localhost:8080/api/books/allGenres")
            .then(response => {
                this.setState({genreOptions: response.data});
                console.log(response);
            })
            .catch(error => {
                console.log(error)
            });
    }

    onInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    onGenreChange = (values) => {
        this.setState({genres: values.map(response => response.label)})
    };

    onAuthorChange = (value) => {
        var index = value[0].value;
        var authorName = value[0].label;
        this.setState({author: index});
    };

    onDateChange = (value) => {
        this.setState({publicationDate: value})
    };

    onReset = () => {
        this.setState({
            title: this.state.oldState.title,
            publicationDate: this.state.oldState.publicationDate,
            author: this.state.oldState.author,
            numberPages: this.state.oldState.numberPages,
            imageUrl: this.state.oldState.imageUrl,
            genres: this.state.oldState.genres
        });
    };

    onFormSubmit = (e) => {
        e.preventDefault();
        this.validateInputs();

        const newBook = new FormData();
        newBook.set('ISBN', this.state.ISBN);
        newBook.set('title', this.state.title);
        newBook.set('publicationDate', this.state.publicationDate);
        newBook.set('author', this.state.author);
        newBook.set('numberPages', this.state.numberPages);
        newBook.set('description', this.state.description);
        newBook.set('genres', this.state.genres);
        newBook.set('imageUrl', this.state.imageUrl);

        axios.patch(`http://localhost:8080/api/books/${this.state.ISBN}`, newBook, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(response => {
                console.log(response);
                this.props.history.push("/books");
            })
            .catch(error => console.log(error.response));
    };

    validateInputs() {
        if (!this.state.title || !this.state.publicationDate || !this.state.numberPages ||
            !this.state.description || !this.state.author || !this.state.genres || !this.state.imageUrl)
            document.getElementById("errorMessage").hidden = false;
        else
            document.getElementById("errorMessage").hidden = true;
    };

    render() {
        return (
            <div>
            {this.state.notFound === true ?
                    <PageNotFound/>
                    :
                    <div style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        paddingTop: "50px",
                        paddingBottom: "50px",
                        width: "100%",
                        height: "100%"
                    }}>
                        <div className="container text-center" style={{
                            marginTop: "0px",
                            width: "60%",
                            padding: "10px",
                            border: "1px solid darkgray",
                            borderRadius: "6px",
                            backgroundColor: "white"
                        }}>
                            <h4>Edit Book</h4>
                            <hr style={{border: "0.5px solid darkgray", padding: 0}}/>
                            <form className={"m-auto"}
                                  style={{width: "90%"}}
                                  onSubmit={this.onFormSubmit}>
                                <input type={"text"}
                                       name={"title"}
                                       placeholder={"Book title"}
                                       className={"form-control my-2"}
                                       onChange={this.onInputChange}
                                       defaultValue={this.state.title}
                                       value={this.state.title}/>
                                <SingleSelect name={"authorName"}
                                              value={""}
                                              selectedAuthor={{label: this.state.authorName,
                                                  value: this.state.author}}
                                              authorOptions={this.state.authorOptions}
                                              authorOptionsIndexes={this.state.authorOptions}
                                              onAuthorChange={this.onAuthorChange}/>
                                <MultipleSelect name={"genres"}
                                                genreOptions={this.state.genreOptions}
                                                onGenreChange={this.onGenreChange}
                                                selectedGenres={this.state.selectedGenres}
                                />
                                <input type={"number"}
                                       name={"numberPages"}
                                       pattern="[0-9]*"
                                       placeholder={"Number of Pages"}
                                       className={"form-control my-2"}
                                       onChange={this.onInputChange}
                                       defaultValue={this.state.numberPages}
                                       value={this.state.numberPages}/>
                                <input type={"text"}
                                       name={"imageUrl"}
                                       placeholder={"Image Url"}
                                       className={"form-control my-2"}
                                       onChange={this.onInputChange}
                                       defaultValue={this.state.imageUrl}
                                       value={this.state.imageUrl}/>
                                <input type={"text"}
                                       name={"publicationDate"}
                                       placeholder={"Publication Date"}
                                       className={"form-control my-2"}
                                       onChange={this.onInputChange}
                                       defaultValue={this.state.publicationDate}
                                       value={this.state.publicationDate}/>
                                <textarea type={"text"}
                                          name={"description"}
                                          placeholder={"Book description"}
                                          className={"form-control my-2"}
                                          onChange={this.onInputChange}
                                          defaultValue={this.state.description}
                                          value={this.state.description}/>
                                <h6 className={"text-danger text-left"}
                                    hidden={true}
                                    id={"errorMessage"}>All Fields Are
                                    Required!</h6>

                                <div className={"row m-0 mt-3 justify-content-end"}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary text-upper m-2"
                                        id="btnSave">
                                        Save
                                    </button>

                                    <button type="button"
                                            onClick={this.onReset}
                                            className="btn btn-warning text-upper m-2">
                                        Reset
                                    </button>

                                    <Link to={"/books"}>
                                        <button type="button"
                                                className="btn btn-danger text-upper my-2 ml-2 mr-0">
                                            Cancel
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
            }
            </div>
        );
    }
}

export default EditBook