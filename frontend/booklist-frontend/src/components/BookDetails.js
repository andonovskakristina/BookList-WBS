import React, {Component} from "react";
import axios from "axios";
import PageNotFound from "./PageNotFound";
import BookCarousel from "./BookCarousel";
import YouMayLikeBooks from "./YouMayLikeBooks";

class BookDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ISBN: this.props.match.params.ISBN,
            title: "",
            publicationDate: "",
            authorName: "",
            description: "",
            numberPages: 0,
            imageUrl: "",
            genres: "",
            notFound: false
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:8080/api/books/${this.state.ISBN}`)
            .then(response => {this.setState({
                title: response.data.title,
                authorName: response.data.author,
                publicationDate: response.data.publicationDate,
                numberPages: response.data.numberPages,
                imageUrl: response.data.imageUrl,
                genres: response.data.genres,
                description: response.data.description,
            });
            })
            .catch(error => {
                console.log(error);
                this.setState({notFound: true});
            });
    }

    render() {
        return(
            <div>
                {this.state.notFound === true ?
                    <PageNotFound/>
                    :
                    <div className={"container my-5"}>
                        <div className={"row"}>
                            <div className={"col-md-3"}>
                                <div style={{width: "90%"}}
                                     className={"text-center"}>
                                    <div className={"row m-auto"}
                                         style={{width: "90%"}}>
                                        <img src={this.state.imageUrl} alt={""}
                                             style={{height: "300px", width: "200px"}}/>
                                    </div>
                                </div>
                            </div>
                            <div className={"col-md-6 text-left"}>
                                <div className={"row"}>
                                    <h4 style={{display: "block"}}>{this.state.title}</h4>
                                </div>
                                <div className={"row"}>
                                    <h6>{this.state.authorName}</h6>
                                </div>
                                <div className={"row"}>
                            <span style={{borderRight: "1px solid darkgray", fontSize: "smaller"}}
                                  className={"pr-1"}>
                                ISBN: {this.state.ISBN}
                            </span>
                                    <span style={{borderRight: "1px solid darkgray", fontSize: "smaller"}}
                                          className={"pr-1 ml-1"}>
                                {this.state.numberPages} pages
                            </span>
                                    <span style={{borderRight: "1px solid darkgray", fontSize: "smaller"}}
                                          className={"pr-1 ml-1"}>
                                          Publication Date: {this.state.publicationDate}
                            </span>
                                    <span className={"ml-1"}
                                          style={{fontSize: "smaller"}}>
                                          Genre: {this.state.genres}
                            </span>
                                </div>
                                <div className={"row mt-3"}>
                                    <div className={"text-break"}>{this.state.description}</div>
                                </div>
                            </div>
                            <div className={"col-md-3 d-flex justify-content-end"}>
                                <div style={{width: "90%"}}>
                                    <div className={"row d-flex justify-content-start"}>
                                        <h5>You may also like</h5>
                                        <hr style={{border: "1px solid darkgray"}}/>

<YouMayLikeBooks/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default BookDetails