import React from "react";
import Books from "./Books";

const ReadBooks = (props) => {
    return(
        <Books read={true} favourite={false}/>
    );
};

export default ReadBooks;