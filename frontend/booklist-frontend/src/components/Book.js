import React, {Component} from "react";
import {Link} from "react-router-dom";
import ModalWindow from "./ModalWindow";

class Book extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ISBN: props.ISBN,
            title: props.title,
            publicationDate: props.publicationDate,
            authorName: props.authorName,
            numberPages: props.numberPages,
            genres: props.genres,
            imageUrl: props.imageUrl
        }
    }

    onDelete = () => {
        this.props.onDelete(this.state.ISBN);
    };

    render() {

        return(
            <div className={"container"}>
                <div className={"row my-3 text-left pl-0"}
                     style={{backgroundColor: "lightgray"}}>
                    <div className={"col-md-3 pl-0"}>
                        <img src={this.state.imageUrl}
                             style={{maxWidth: "250px", maxHeight: "200px", width: "100%"}}/>
                    </div>
                    <div className={"col-md-7 mt-3 pl-0"}>
                        <h5>{this.state.title}</h5>
                        <div className={"mt-2"}>
                            <div>
                                <span className="fa fa-user mr-2"/>
                                <span>{this.state.authorName}</span>
                            </div>
                            <div>
                                <span className="fa fa-pencil mr-2"/>
                                <span>{this.state.genres}</span>
                            </div>
                            <div>
                                <span className="fa fa-calendar mr-2"/>
                                <span>{this.state.publicationDate}</span>
                            </div>
                            <div>
                                <span className="fa fa-book mr-2"/>
                                <span>{this.state.numberPages} pages</span>
                            </div>
                            <Link to={`/books/${this.state.ISBN}/details`}
                                  className="text-dark">
                                <span><strong>Read more</strong></span>
                            </Link><br/>
                        </div>
                    </div>
                    <div className={"col-md mt-3"}>
                        <div className={"d-flex justify-content-end"}>
                        <Link to={`/books/${this.state.ISBN}/edit`}
                              className="btn btn-sm btn-secondary mx-1"
                              title={"Edit Book"}>
                            <span className="fa fa-edit"/>
                        </Link>
                            <ModalWindow title={this.state.title} onDelete={this.onDelete}/>
                        </div>

                    </div>
                </div>
            </div>
            )
    }
}

export default Book