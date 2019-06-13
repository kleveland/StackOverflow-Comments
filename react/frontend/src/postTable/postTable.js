import React from 'react';
import './postTable.scss';
import PostTablePagination from './postTablePagination';
import PostTableLimit from './postTableLimit';
import PostTableSearch from './postTableSearch';

class PostTable extends React.Component {

    headers = [
        { name: 'Id', order: null, style: { width: '5%' } },
        { name: 'CreationDate', order: null, style: { width: '12%' } },
        { name: 'Text', order: null, style: { width: '75%' } },
        { name: 'Score', order: null, style: { width: '3%' } },
        { name: 'Link', order: null, style: { width: '5$' }}
    ];

    // Stores the sort order
    order = [];

    state = {
        isLoading: true,
        limit: 10,
        searchStr: null,
        pagedata: {
            current: 1,
            prev: null,
            next: 2
        },
        posts: [],
        error: null
    };

    componentDidMount() {
        this.makePostsRequest();
    }

    // Runs on click of header, currently performs sorting
    onHeaderClick(obj) {
        console.log(obj);
        if (obj.order === null) {
            obj.order = '1';
        } else if (obj.order === '1') {
            obj.order = '-1';
        } else {
            obj.order = null;
        }
        this.order = this.order.filter((val) => {
            return val.name !== obj.name;
        });
        if (obj.order) {
            this.order.push(obj);
        }
        this.makePostsRequest();
    }

    // Changes the page to the new specified page (defaults to the last page)
    changePage(newPage = this.state.pagedata.last) {
        this.makePostsRequest(this.order, this.state.limit, newPage);
    }

    // Updates the state with the text string and makes a request with the text string
    submitTextSearch(text) {
        this.setState({ searchStr: text }, () => {
            this.makePostsRequest();
        });
    }

    // Makes the request to the express server with the specified parameters
    makePostsRequest = (order = this.order,
        limit = (this.state.limit) ? this.state.limit : 10,
        page = (this.state.pagedata) ? this.state.pagedata.current : 1) => {
        order = '?';
        // creates the order part of the request url
        for (let i = 0; i < this.order.length; i++) {
            order = order + "order[" + this.order[i].name + "]=" + this.order[i].order + '&';
        }
        let reqUrl = '/posts' + order + '&limit=' + limit + '&page=' + page;
        // Adds on the search part of the request url if found
        if (this.state.searchStr) {
            reqUrl = reqUrl + '&search=' + this.state.searchStr;
        }
        console.log('Making Request to ', reqUrl);
        let noResults = false;
        fetch(reqUrl)
            .then((res) => {
                // Determines if no results are found
                // Future handling: determine by an ID and not by a 404
                if (res.status === 404) {
                    noResults = true;
                }
                return res.json()
            })
            .then((data) => {
                if (noResults) {
                    // Sets the error state for no results being found
                    this.setState({ error: data.message, pagedata: { current: 1, prev: null, next: null} });
                } else {
                    // Sets the state for finding some number of results
                    this.setState({ limit: data.limit, pagedata: data.pagedata, posts: data.result, error: null, isLoading: false }, () => {
                        if (data.result.length === 0) {
                            this.changePage();
                        }
                    });
                }
            }).catch((err) => {
                console.log(err);
                this.setState({ error: err });
            });
    }

    // Function to create the elements for the table headers
    createHeaders() {
        const arr = [];
        let orderEl;
        for (let i = 0; i < this.headers.length; i++) {
            if (this.headers[i].order === '1') {
                orderEl = <span>▲</span>;
            } else if (this.headers[i].order === '-1') {
                orderEl = <span>▼</span>
            } else {
                orderEl = <span></span>
            }
            arr.push(
                <th style={this.headers[i].style} onClick={() => { this.onHeaderClick(this.headers[i], this.makePostsRequest) }} key={i} scope="col">
                    {this.headers[i].name}
                    {orderEl}
                </th>);
        }
        return arr;
    }

    // Function to create the rendering for the n number of rows
    postRows = () => {
        const { posts, isLoading, error } = this.state;
        if (error) {
            return <tr><td colSpan={this.headers.length}>{error}</td></tr>;
        }
        if (isLoading) {
            return <tr><td colSpan={this.headers.length}>Loading...</td></tr>
        }
        const dateOptions = { day: "numeric", weekday: "short", year: "numeric", month: "numeric", hour: "numeric", minute: "numeric" }
        return posts.map((post, i) => (
            <tr key={i}>
                <th scope="row">{post.Id}</th>
                <td>{new Date(post.CreationDate).toLocaleDateString("en-US", dateOptions)}</td>
                <td>{post.Text}</td>
                <td>{post.Score}</td>
                <td><a href={'https://stackoverflow.com/a/' + post.PostId}>View</a></td>
            </tr>
        ));
    };

    render() {
        return (
            <div className="tableStyling">
                <nav className="d-flex">
                    <div className="mr-auto">
                        <PostTableLimit parentRef={this} />
                    </div>
                    <div className="flex-fill fillPadding">
                        <PostTableSearch parentRef={this} />
                    </div>
                    <PostTablePagination pagedata={this.state.pagedata} changePage={this.changePage} parentRef={this} />
                </nav>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {this.createHeaders()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.postRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default PostTable;
