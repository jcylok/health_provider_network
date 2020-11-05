import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import API from "../../constant";
import "../Provider/provider.scss";


class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      npi: '',
      location: {
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postal_code: ''
      },
      address: {
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postal_code: ''
      },
      error: ''
    };
  }

  componentDidMount() {

    const providerId = window.location.href.split("/").pop();
    axios.get(this.getDetails(providerId))
    .then(res => {
      let data = res.data.results[0]
      this.setState({
        name: data.basic.name,
        npi: data.number,
        location: data.addresses[0],
        address: data.addresses[1], 
      })
    })
    .catch(error => {
      this.setState({ error })
    })
  }

  getDetails(providerId) {
    return (`${API}/?number=${providerId}&version=2.1`)
  }

  render() {
    let provider = this.state;

    if (provider.error) {
      return (
        <div>No data found.</div>
      )
    } else if (provider.npi) {
      return (
        <>
        <h1>Provider's Info</h1>
        <div className="card">
          <div className="title">
            <h2>{provider.name}</h2>
            <p>NPI number: {provider.npi}</p>
          </div>
  
          <div className="locations-wrapper">
            <div className="locations">
              <h3>Practice Location</h3>
              <p><strong>Address: </strong> &ensp;{provider.location.address_1 + provider.location.address_2} </p>
              <p><strong>City: </strong> &ensp;{provider.location.city} </p>
              <p><strong>State: </strong> &ensp;{provider.location.state} </p>
              <p><strong>Postal Code: </strong>&ensp;{provider.location.postal_code} </p>
            </div>
            <div className="locations">
              <h3>Mailing Address</h3>
              <p><strong>Address: </strong> &ensp;{provider.address.address_1 + provider.address.address_2} </p>
              <p><strong>City: </strong> &ensp;{provider.address.city} </p>
              <p><strong>State: </strong> &ensp;{provider.address.state} </p>
              <p><strong>Postal Code: </strong> &ensp;{provider.address.postal_code} </p>
            </div>
          </div>
        </div>
        </>
      )

    } else {
      return (
        <div>Loading...</div>
      )
    }
  }
}

export default withRouter(Provider);
