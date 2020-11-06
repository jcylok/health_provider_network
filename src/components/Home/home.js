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
      searchBox: null,
      firstName: '',
      lastName: '',
      organization: '',
      results: [],
      skipFirst: 0,
      nextTen: [],
      existNextTen: false,
    };
    this.firstNameChange = this.firstNameChange.bind(this);
    this.lastNameChange = this.lastNameChange.bind(this);
    this.organizationChange = this.organizationChange.bind(this);
    this.enterClicked = this.enterClicked.bind(this);
    this.search = this.search.bind(this);
    this.showResult = this.showResult.bind(this);
    this.getProvider = this.getProvider.bind(this);
    this.checkNextTen = this.checkNextTen.bind(this);
    this.searchNextTen = this.searchNextTen.bind(this);
  }
  
  firstNameChange(event) {
    event.preventDefault();
    this.setState({
      firstName: event.target.value
    })
  }

  lastNameChange(event) {
    event.preventDefault();
    this.setState({
      lastName: event.target.value
    })
  }

  organizationChange(event) {
    event.preventDefault();
    this.setState({
      organization: event.target.value
    })
  }

  enterClicked() {
    this.setState({skipFirst:0, existNextTen: false}, () => {this.search()})
  }

  getApi(firstName, lastName, organization, skipFirst) {
    return (`${API}/?number=&enumeration_type=&taxonomy_description=&first_name=${firstName}&use_first_name_alias=&last_name=${lastName}&organization_name=${organization}&address_purpose=&city=&state=&postal_code=&country_code=&limit=10&skip=${skipFirst}&version=2.1`)
  }

  search() {

    const apiEndPoint = this.getApi(this.state.firstName, this.state.lastName, this.state.organization, this.state.skipFirst)
    axios.get(apiEndPoint)

      .then(res => {
        const results = res.data;
        this.setState({ results });

        // Check Next Ten
        this.checkNextTen()
      })
      .catch(error => {
        this.setState({ error });
      })
  }

  checkNextTen() {

    const apiEndPoint = this.getApi(this.state.firstName, this.state.lastName, this.state.organization, this.state.skipFirst+ 10)
    axios.get(apiEndPoint)
    
    .then(res => {
      const nextTen = res.data;
      this.setState({ nextTen });
      if (nextTen.result_count > 0) {
        this.setState({existNextTen: true})
      } else {
        this.setState({existNextTen: false})
      }

    })
    .catch(error => {
      this.setState({ error });
    })
  }

  searchNextTen() {
    let newSkip = this.state.skipFirst + 10
    this.setState({skipFirst: newSkip }, () => {
      this.search()
    })

  }

  searchPreviousTen() {
    let newSkip = this.state.skipFirst - 10
    this.setState({skipFirst: newSkip }, () => {
      this.search()
    })

  }

  showResult() {
    let providers = this.state.results;
    let rendering = []

    if (providers.Errors || providers.result_count === 0) {
      return (
        <div>
          No matched results.
        </div>
      )
    } else if (providers.results) {
        rendering.push(
          <div className="row-var">
            <div className="column-var" >
              <p>ID</p>
            </div>
            <div className="column-var" >
              <p>PROVIDER</p>
            </div>
            <div className="column-var">
              <p>CITY</p>
            </div>
            <div className="column-var">
              <p>STATE</p>
            </div>
          </div>
        )
        for (let provider of providers.results) {

          rendering.push(
            <div className="row" onClick={() => this.getProvider(provider.number)} key={provider.number}>
              <div className="column">
                <p>{provider.number}</p>
              </div>
              <div className="column">
                <p>{provider.basic.organization_name || (provider.basic.first_name + " " + provider.basic.last_name)}</p>
              </div>
              <div className="column">
                <p>{provider.addresses[0].city}</p>
              </div>
              <div className="column">
                <p>{provider.addresses[0].state}</p>
              </div>
            </div>  
          )
        }
    }
 
    if (providers.results) {
      rendering.push(
        <div className="navigate-result">
          <button onClick={() => this.searchPreviousTen()} disabled={this.state.skipFirst === 0}>Back</button>
          <button onClick={() => this.searchNextTen()} disabled={!this.state.existNextTen}>Next</button>
        </div>
      )
    }
    return rendering;
  }

  getProvider(providerId) {
    window.open(`/provider/${providerId}`, "_blank")
  }

  render() {

    return (
      <div className="home">
        <h1>Health Provider Network</h1>
        <h3>Search by</h3>
        <button disabled={this.state.searchBox==='name'} onClick={() => this.setState({searchBox: 'name', organization: '', results: []})}>Name</button>
        <button disabled={this.state.searchBox==='organization'} onClick={() => this.setState({searchBox: 'organization', firstName: '', lastName: '', results: []})}>Organization</button>
        <div className="search-box" style={this.state.searchBox? {}:{display:'none'}}>
          <div className="search-box-name" style={this.state.searchBox === 'name'? {}:{display:'none'}}>
            <div className="form-row">
              <label>First Name:</label>
              <input type="text" onChange={this.firstNameChange} value={this.state.firstName}/>
            </div>
            <div className="form-row">
              <label>Last Name:</label>
              <input type="text" onChange={this.lastNameChange} value={this.state.lastName}/>
            </div>

          </div>
          <div className="search-box-organization" style={this.state.searchBox === 'organization'? {}:{display:'none'}}>
            <div className="form-row">
              <label>Organization:</label>
              <input type="text" onChange={this.organizationChange} value={this.state.organization}/>
            </div>
          </div>
          <button onClick={this.enterClicked} style={this.state.searchBox? {}: {display:'none'}}>Search</button>
        </div>
        <div className="result-box">
          {this.showResult()}
        </div>
      </div>
    )
  }
}

export default withRouter(Home);