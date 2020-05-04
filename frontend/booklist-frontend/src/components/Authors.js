import React, {Component} from "react";
import Author from "./Author";
import axios from "axios";
import ReactPaginate from "react-paginate";

class Authors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            List: [],
            page: 0,
            pageSize: 10,
            totalPages: 0
        }
    }

    componentDidMount() {
        this.fetchAuthors();
    }

    fetchAuthors = (page = this.state.page,
                    size = this.state.pageSize) => {
        axios.get(`http://localhost:8080/api/books/authors?page=${page}&pageSize=${size}`)
            .then(response => {
                this.setState({
                    List: response.data.content,
                    page: response.data.pageable.pageNumber,
                    pageSize: response.data.pageable.pageSize,
                    totalPages: response.data.totalPages
                });
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    };

    handlePageClick = (pageChangedEvent) => {
        this.fetchAuthors(pageChangedEvent.selected);
    };

    renderPaginate = () =>
        <ReactPaginate previousLabel={'← Previous'}
                       nextLabel={'Next →'}
                       breakLabel={<span className="gap">...</span>}
                       breakClassName={'break-me'}
                       pageCount={this.state.totalPages}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       pageClassName={'page-item'}
                       pageLinkClassName={'page-link btn'}
                       previousClassName={'page-item'}
                       nextClassName={'page-item'}
                       previousLinkClassName={'page-link btn'}
                       nextLinkClassName={'page-link btn btn-outline-secondary'}
                       forcePage={this.state.page}
                       onPageChange={this.handlePageClick}
                       containerClassName={'pagination justify-content-center'}
                       activeClassName={'active'}
                       activeLinkClassName={'active bg-secondary border-secondary'}
                       disabledClassName={"disabled"}
        />;

    render() {
        const newList = this.state.List.map(author =>
            <Author key={author.name}
                        name={author.name}
                        books={author.bookNames}
            />);
        return (
            <div className="container mt-5 text-center">
                <div className="row d-flex justify-content-center">
                    {this.state.List.length > 0 ?
                        <div>
                            <div className="table-responsive">
                                <table className="table tr-history table-striped table-bordered small">
                                    <thead className={"thead-dark"}>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Books</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {newList}
                                    </tbody>
                                </table>
                                {this.renderPaginate()}
                            </div>
                        </div>
                        :
                        <h3>The List of Authors is empty</h3>}
                </div>
            </div>
        )
    }
}

export default Authors