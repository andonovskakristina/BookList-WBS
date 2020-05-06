import React, {Component} from "react";
import {Link} from "react-router-dom";
import "../css/suggestedBook.css";

class SuggestedBooks extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ISBN: props.ISBN,
            title: props.title,
            imageUrl: props.imageUrl
        }
    }

    render() {
        return(
            <div className={"container my-2 card-hover"}>
                <div className={"row text-left pl-0"}
                     style={{backgroundColor: "lightgray"}}>
                    <div className={"col-md-3 pl-0"}>
                        <img src={this.state.imageUrl} alt={"image"} className={"img-responsive"}
                             style={{width: "70px", height: "100px"}}/>
                    </div>
                    <div className={"col-md-7 mt-3 pl-0 ml-3"}>
                        <p style={{textOverflow: "elipsis",
                            overflow: "hidden",
                            maxHeight: "50px",
                            maxWidth: "105px"}}>
                            {this.state.title}
                        </p>
                            <div className={"mt-1"}>
                                <a href={`/books/${this.state.ISBN}/details`}
                                      className="text-dark">
                                    <span><strong>Read more</strong></span>
                                </a>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default SuggestedBooks;