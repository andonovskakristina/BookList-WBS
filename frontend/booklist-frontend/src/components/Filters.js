import React, {Component} from "react";
import axios from "axios";
import RangeSlider from "./Slider";
import MultipleSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";

class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genreOptions: [],
            authorOptions: [],
            selectedGenres: [],
            selectedAuthors: [],
            search: ""
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/books/allGenres")
            .then(response => {
                this.setState({genreOptions: response.data});
                console.log(response);
            })
            .catch(error => {
                console.log(error)
            });

        axios.get("http://localhost:8080/api/books/allAuthors")
            .then(response => {
                this.setState({authorOptions: response.data});
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    onGenreChange = (values) => {
        {console.log(values.map(response => response.label))}
        this.setState({selectedGenres: values.map(response => response.label)})
    };

    onAuthorChange = (values) => {
        var authors = values.map(val => val.value);
        this.setState({selectedAuthors: authors});
    };

    onSearchChange = (e) => {
        this.setState({search: e.target.value});
    };

    render() {
        return (
            <div className={"text-center justify-content-center p-3"}
                 style={{width: "100%", backgroundColor: "whitesmoke"}}>
                <h5>Filters</h5>
                <hr/>
                <div className={"row text-center d-flex justify-content-center m-0"}>
                    <form className="form-inline"
                          style={{width: "90%"}}>
                        <div className={"text-center"}>
                        <i className="fa fa-search"
                           aria-hidden="true"></i>
                        <input className="form-control form-control-sm ml-3 w-75"
                               type="text"
                               placeholder="Search"
                               aria-label="Search"
                               onChange={this.onSearchChange}
                               value={this.state.search}
                        />
                        </div>
                    </form>
                </div>
                <hr/>
                <div className={"row text-center justify-content-center"}>
                    <h6>Genre Filter</h6>
                    <div className={"row justify-content-center"}
                         style={{width: "100%"}}>
                        <div style={{width: "90%"}}>
                        <MultipleSelect name={"genres"}
                                        genreOptions = {this.state.genreOptions}
                                        onGenreChange={this.onGenreChange}
                                        style={{height: "100px"}}
                        />
                        </div>
                    </div>
                </div>
                <hr/>
                <div className={"row text-center justify-content-center"}>
                    <h6>Author Filter</h6>
                    <div className={"row justify-content-center"}
                         style={{width: "100%"}}>
                        <div style={{width: "90%"}}>
                            <SingleSelect name={"authorName"}
                                          value={""}
                                          authorOptions={this.state.authorOptions}
                                          authorOptionsIndexes={this.state.authorOptions}
                                          onAuthorChange={this.onAuthorChange}
                                          isMulti={true}
                            />
                        </div>
                    </div>
                </div>
                <hr/>
                <button className={"btn btn-outline-secondary"}
                        style={{width: "100%"}}
                        onClick={()=>this.props.onFilter(this.state.selectedAuthors, this.state.search, this.state.selectedGenres)}
                >
                    Filter
                </button>
            </div>
        )
    }
}

export default Books