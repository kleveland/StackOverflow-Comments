import React from 'react';

class PostTableLimit extends React.Component {

    state = { searchInp: '' };

    // Sets the state for this class
    changeStrInput = (event) => {
       this.setState({ searchInp: event.target.value });
    }

    render() {
        return (
            <div className="input-group">
                <input type="text" className="form-control" placeholder="Search Text Input" aria-label="Search Text Input" aria-describedby="textSearch" value={this.state.searchInp} onChange={this.changeStrInput} />
                <div className="input-group-append">
                    <button className="btn btn-primary" type="button" id="textSearch" onClick={() => { this.props.parentRef.submitTextSearch(this.state.searchInp) }}>Search Text</button>
                </div>
            </div>    
        )
    }
}

export default PostTableLimit;
