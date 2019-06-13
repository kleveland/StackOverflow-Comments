import React from 'react';
import './App.scss';
import PostTable from './postTable/postTable';

class App extends React.Component {

  createTable() {
    return <PostTable />;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>StackExchange Comments Data</h2>
        </div>
        <div className="fluid-container">
          <div className="row justify-content-center remove-margins">
            <div className="col-sm-12 col-md-10">
              <PostTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
