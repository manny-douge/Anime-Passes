import React, { Component } from 'react';
import NavBar from "./Components/NavBar";
import PageContent from "./Components/PageContent";

import './App.css';
import './mobileApp.css';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <PageContent/>
      </div>
    );
  }
}

export default App;
