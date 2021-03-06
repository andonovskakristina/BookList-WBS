import React from 'react';
import './App.css';
import Header from "./components/Header";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Books from "./components/Books";
import CreateNewBook from "./components/CreateNewBook";
import EditBook from "./components/EditBook";
import BookDetails from "./components/BookDetails";
import ReadBooks from "./components/ReadBooks";
import FavouriteBooks from "./components/FavouriteBooks";
import Home from "./components/Home";
import Authors from "./components/Authors";

function App() {
  return (
    <div className="App">
        <Router>
            <Header/>
            <Switch>
                <Route path={"/books/:ISBN/edit"} component={EditBook}/>
                <Route path={"/books/:ISBN/details"} component={BookDetails}/>
                <Route path={"/books"} exact component={() => <Books/>}/>
                <Route path={"/books/new"} component={CreateNewBook}/>
                <Route path={"/authors"} component={Authors}/>
                <Route path={"/"} component={Home}/>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
