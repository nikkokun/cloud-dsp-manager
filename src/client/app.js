import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Users from './users/users';
import Home from './home/Home';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

const styles = theme => ({
  main: {
    padding: 3 * theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      padding: 2 * theme.spacing.unit,
    },
  },
});


class App extends Component {
  render() {
    console.log('ran');
    return (
      <CssBaseline>
        <Router>
          <Switch>
            <Route exact path='/users/' component={Users}/>
            <Route exact path='/home/' component={Home}/>
            <Route path='/users/:id' component={Users}/>
          </Switch>
        </Router>
      </CssBaseline>
    );
  }
}

export default withStyles(styles)(App);
