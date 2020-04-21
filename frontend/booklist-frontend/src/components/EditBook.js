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
            authorId: 0,
            review: 0,
            numberPages: 0,
            imageUrl: "",
            genres: "",
            description: "",
            oldState: {},
            authorOptions: [],
            genreOptions: [],
            authorOptionsIndexes: [],
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
                    authorId: response.data.authorId,
                    authorName: response.data.authorName,
                    review: response.data.review,
                    numberPages: response.data.numberPages,
                    imageUrl: response.data.imageUrl,
                    genres: response.data.bookGenres,
                    description: response.data.description,
                    selectedGenres: response.data.bookGenres.split(',').map((name) => ({
                        label: name,
                        value: name
                    })),
                    notFound: false,
                    oldState: {
                        "ISBN": this.state.ISBN,
                        "title": response.data.title,
                        "publicationDate": response.data.publicationDate,
                        "authorId": response.data.authorId,
                        "authorName": response.data.authorName,
                        "review": response.data.review,
                        "numberPages": response.data.numberPages,
                        "imageUrl": response.data.imageUrl,
                        "genres": response.data.bookGenres,
                        "description": response.data.description
                    }
                })
            })
            .catch(error => {
                console.log(error);
                this.setState({notFound: true});
            });

        axios.get("http://localhost:8080/api/authors")
            .then(response => {
                this.setState({authorOptions: response.data.content.map(author => author.name)});
                this.setState({authorOptionsIndexes: response.data.content.map(author => author.id)});
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });

        axios.get("http://localhost:8080/api/genres")
            .then(response => {
                this.setState({genreOptions: response.data.map(genre => genre.name)});
                console.log(response);
            })
            .catch(error => {
                console.log(error)
            });
    }

    onInputChange = (e) => {
        if (e.target.name === "review" && e.target.value > 5.00)
            e.target.value = 5.00;
        this.setState({[e.target.name]: e.target.value});
    };

    onGenreChange = (values) => {
        this.setState({genres: values.map(response => response.label)})
    };

    onAuthorChange = (value) => {
        var index = value[0].value;
        var authorName = value[0].label;
        this.setState({authorId: index});
    };

    onDateChange = (value) => {
        this.setState({publicationDate: value})
    };

    onReset = () => {
        this.setState({
            title: this.state.oldState.title,
            publicationDate: this.state.oldState.publicationDate,
            authorId: this.state.oldState.authorId,
            review: this.state.oldState.review,
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
        newBook.set('author', this.state.authorId);
        newBook.set('review', this.state.review);
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
        if (!this.state.publicationDate) {
            date = Date.now();
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            var date = [year, month, day].join('-');
            this.setState({publicationDate: date});
        }

        if (!this.state.title || !this.state.publicationDate || !this.state.numberPages ||
            !this.state.review || !this.state.description || !this.state.authorId || !this.state.genres || !this.state.imageUrl)
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
                                                  value: this.state.authorId}}
                                              authorOptions={this.state.authorOptions}
                                              authorOptionsIndexes={this.state.authorOptionsIndexes}
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
                                <input type={"number"}
                                       step={".01"}
                                       max={"5.00"}
                                       name={"review"}
                                       placeholder={"Book review"}
                                       className={"form-control my-2"}
                                       onChange={this.onInputChange}
                                       defaultValue={this.state.review}
                                       value={this.state.review}/>
                                <input type={"text"}
                                       name={"imageUrl"}
                                       placeholder={"Image Url"}
                                       className={"form-control my-2"}
                                       onChange={this.onInputChange}
                                       defaultValue={this.state.imageUrl}
                                       value={this.state.imageUrl}/>
                                <textarea type={"text"}
                                          name={"description"}
                                          placeholder={"Book description"}
                                          className={"form-control my-2"}
                                          onChange={this.onInputChange}
                                          defaultValue={this.state.description}
                                          value={this.state.description}/>
                                <div className={"text-left my-2"}
                                     style={{color: "#495057"}}>Publication Date:
                                    <DatePickerr
                                        name={"publicationDate"}
                                        onChange={this.onInputChange}
                                        onDateChange={this.onDateChange}
                                        selectedDate={this.state.publicationDate}
                                    />
                                </div>
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