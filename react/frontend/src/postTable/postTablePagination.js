import React from 'react';

class PostTablePagination extends React.Component {


    state = {pageInput: ''};

    renderPreviousPage() {
        if (this.props.pagedata.prev) {
            return <li onClick={ () => { this.props.parentRef.changePage(this.props.pagedata.prev)}} className="page-item">
                <button className="page-link">{this.props.pagedata.prev}</button>
            </li>
        }
    }

    renderFirstPage() {
        if (this.props.pagedata.prev) {
            return <li onClick={ () => { this.props.parentRef.changePage(1)} } className="page-item">
                <button className="page-link" tabIndex="-1" aria-disabled="true">First</button>
            </li>
        }
    }

    renderNextPage() {
        if (this.props.pagedata.next) {
            return <li onClick={ () => { this.props.parentRef.changePage(this.props.pagedata.next)} } className="page-item">
                <button className="page-link">{this.props.pagedata.next}</button>
            </li>
        }
    }

    renderLastPage() {
        if (this.props.pagedata.next) {
            return <li onClick={ () => { this.props.parentRef.changePage(this.props.pagedata.last)} } className="page-item">
                <button className="page-link">Last</button>
            </li>
        }
    }

    changePageInput = (event) => {
        this.setState({pageInput: event.target.value});
    }

    render() {
        return (
                <ul className="pagination justify-content-end">
                    <li className="manualPage">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Page #" aria-label="Page #" aria-describedby="manualPage" value={this.state.pageInput} onChange={this.changePageInput} />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button" id="manualPage" onClick={() => { this.props.parentRef.changePage(this.state.pageInput) }}>Go to Page</button>
                            </div>
                        </div>    
                    </li>
                    {this.renderFirstPage()}
                    {this.renderPreviousPage()}
                    <li className="page-item active">
                        <span className="page-link" href="#" aria-current="page">
                            {this.props.pagedata.current}
                        </span>
                    </li>
                    {this.renderNextPage()}
                    {this.renderLastPage()}
                </ul>
        )
    }
}

export default PostTablePagination;
