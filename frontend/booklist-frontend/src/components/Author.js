import React, {Component} from "react";

class Author extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            books: props.books
        }
    }

    render() {
        var rowSpan = this.state.books.length;
        var rows = [];
        if(rowSpan > 0) {
            rows = this.state.books.map(book => <tr><td>{book}</td></tr>)
        }

        return(
            <React.Fragment>
            <tr>
                <td rowSpan={rowSpan} className={"align-middle"}>{this.state.name}</td>
                {rowSpan > 0 ? <td>{this.state.books[0]}</td> : <td></td>}
            </tr>
                {rowSpan > 1 ? rows.slice(1, rows.length) : <></>}
            </React.Fragment>
        )
    }
}

export default Author