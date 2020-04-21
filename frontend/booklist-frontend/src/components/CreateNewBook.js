import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import backgroundImage from "../images/createNewBackground.jpg"
import MultipleSelect from "./MultipleSelect";
import css from "../css/createNewBook.css"
import DatePickerr from "./DatePicker";
import SingleSelect from "./SingleSelect";

class CreateNewBook extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ISBN: "",
            title: "",
            publicationDate: "",
            authorId: 0,
            review: 0,
            description: "",
            numberPages: 0,
            imageUrl: "",
            read: false,
            favourite: false,
            genres: "",
            authorOptions: [],
            genreOptions: [],
            authorOptionsIndexes: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/authors/allAuthors")
            .then(response => {
                this.setState({authorOptions: response.data.map(author => author.name)});
                this.setState({authorOptionsIndexes: response.data.map(author => author.id)});
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
                console.log(error);
            });
    }

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

        axios.post("http://localhost:8080/api/books",newBook , {
            headers: {
                'Content-Type':'application/json'
            }}
        )
            .then(response => {
                console.log(response);
                this.props.history.push("/books");
            })
            .catch(error => console.log(error.response));
    };

    onGenreChange = (values) => {
        {console.log(values.map(response => response.label))}
        this.setState({genres: values.map(response => response.label)})
    };

    onAuthorChange = (value) => {
        var index = value[0].value;
        var authorName = value[0].label;
        this.setState({authorId: index});
    };

    onInputChange = (e) => {
        if(e.target.name === "review" && e.target.value > 5.00)
            e.target.value = 5.00;
        this.setState({[e.target.name]: e.target.value});
    };

    onDateChange = (value) => {
        this.setState({publicationDate: value})
    };

    validateInputs() {
        if(!this.state.publicationDate) {
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

        if(!this.state.ISBN || !this.state.title || !this.state.publicationDate || !this.state.numberPages ||
        !this.state.review || !this.state.description || !this.state.authorId || !this.state.genres || !this.state.imageUrl)
            document.getElementById("errorMessage").hidden = false;
        else
            document.getElementById("errorMessage").hidden = true;
    };

    render() {
        return (
            <div style={{backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover", paddingTop: "50px",
                paddingBottom: "50px", width: "100%", height: "100%"}}>
            <div className="container text-center"
                 style={{marginTop: "0px", width: "60%", padding: "10px",
                     border: "1px solid darkgray", borderRadius: "6px", backgroundColor: "white"}}>
                <h4>Create New Book</h4>
                <hr style={{border: "0.5px solid darkgray", padding: 0}}/>
                <form className={"m-auto"}
                      style={{width: "90%"}}
                      onSubmit={this.onFormSubmit}>
                    <input type={"text"}
                           name={"title"}
                           placeholder={"Book title"}
                           className={"form-control my-2"}
                           onChange={this.onInputChange}/>
                    <input type={"text"}
                           name={"ISBN"}
                           placeholder={"Book ISBN"}
                           className={"form-control my-2"}
                           onChange={this.onInputChange}/>
                    <SingleSelect name={"authorName"}
                                  value={""}
                                  authorOptions={this.state.authorOptions}
                                  authorOptionsIndexes={this.state.authorOptionsIndexes}
                                  onAuthorChange={this.onAuthorChange}
                                  isMulti={false}/>
                    <MultipleSelect name={"genres"}
                                    genreOptions = {this.state.genreOptions}
                                    onGenreChange={this.onGenreChange}/>
                    <input type={"number"}
                           name={"numberPages"}
                           pattern="[0-9]*"
                           placeholder={"Number of Pages"}
                           className={"form-control my-2"}
                           onChange={this.onInputChange}/>
                    <input type={"number"}
                           step={".01"}
                           max={"5.00"}
                           name={"review"}
                           placeholder={"Book review"}
                           className={"form-control my-2"}
                           onChange={this.onInputChange}/>
                    <input type={"text"}
                           name={"imageUrl"}
                           placeholder={"Image Url"}
                           className={"form-control my-2"}
                           onChange={this.onInputChange}/>
                    <textarea type={"text"}
                              name={"description"}
                              placeholder={"Book description"}
                              className={"form-control my-2"}
                              onChange={this.onInputChange}/>
                    <div className={"text-left my-2"}
                         style={{color: "#495057"}}>Publication Date
                        <DatePickerr name={"publicationDate"}
                                     onChange={this.onInputChange}
                                     onDateChange={this.onDateChange}/>
                    </div>
                    <h6 className={"text-danger text-left"}
                        hidden={true}
                        id={"errorMessage"}>
                        All Fields Are Required!
                    </h6>

                    <div className={"row m-0 mt-3 justify-content-end"}>
                        <button
                            type="submit"
                            className="btn btn-primary text-upper m-2"
                            id="btnSave">
                            Save
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
        );
    }
}

export default CreateNewBook