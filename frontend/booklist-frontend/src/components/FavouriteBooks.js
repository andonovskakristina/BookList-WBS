import React from "react";
import Books from "./Books";

const FavouriteBooks = (props) => {
    return(
        <Books read={false} favourite={true}/>
    );
};

export default FavouriteBooks;