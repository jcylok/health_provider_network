import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import API from "../../constant";
import "../Provider/provider.scss";


class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <div>provider page.</div> 
    )
  }
}

export default withRouter(Provider);
