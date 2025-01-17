import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../components/Home/home';
import Provider from '../components/Provider/provider';

export default () => (
  <Switch>
      <Route exact path='/' component={ Home }/>
      <Route path='/provider/:Id' component={ Provider }/>
  </Switch>
);