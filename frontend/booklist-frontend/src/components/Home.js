import React, {Component} from 'react'
import HomeImage from "../images/home.png"
import BookCarousel from "./BookCarousel";
import Footer from "./Footer";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            home:true
        }
    }

    render()
    {
        return (
            <div style={{textAlign: "left !important", fontSize: "1rem !important"}} className={"bg-light"}>
                <img src={HomeImage}
                     style={{width: "100%"}}
                     className={"mb-5"}
                     alt={""}
                />
                <div className={"m-auto w-50 pb-5"}>
                    <BookCarousel home={true}/>
                </div>
                <Footer/>
            </div>
        )
    };
}

export default Home;