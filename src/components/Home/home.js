// home.js
// This file is for homepage.

import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import API from "../../constant";
import "../Home/home.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {

    return (
      <div className="home">
        home page
      </div>
    )
  }
}

export default withRouter(Home);