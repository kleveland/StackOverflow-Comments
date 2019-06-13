import React from 'react';

class PostTableLimit extends React.Component {

    // Handles the login to change the limit size of the requested posts
    changeLimit = (event) => {
        this.props.parentRef.setState({ limit: event.target.value }, () => {
            this.props.parentRef.makePostsRequest();
        });
    }

    render() {
        return (
            <select className="custom-select" defaultValue={10} onChange={this.changeLimit}>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
            </select>
        )
    }
}

export default PostTableLimit;
