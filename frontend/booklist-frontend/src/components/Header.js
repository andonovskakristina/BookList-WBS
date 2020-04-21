import React from "react";
import {Link} from 'react-router-dom';
import menuImage from '../images/menuImage.png'

function Header(){
    return(
        <header className="position-relative">
            <img src={menuImage}
                 className="img-thumbnail"
                 style={{width: "100%", border: 0, padding: 0, height: "70px"}}/>
            <nav className="navbar navbar-expand-md navbar-fixed navbar-dark position-absolute"
                 style={{top: "0px", left: "16px", fontSize: "18px !important", TextShadow: "0 0 20px black"}}>
                <Link to="/">
                    <a className="navbar-brand">Home</a>
                </Link>
                <button className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarCollapse"
                        aria-controls="navbarCollapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse"
                     id="navbarCollapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className={"nav-link"}
                                  to="/authors">
                                <a className="nav-link">Authors</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link"}
                                  to="/books"
                                  read={false}>
                                <a className="nav-link">Books</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link"}
                                  to="/books/read">
                                <a className="nav-link">Read Books</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link"}
                                  to="/books/favourite">
                                <a className="nav-link">Favourite Books</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header