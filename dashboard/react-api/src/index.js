import React from 'react';
import ReactDOM from 'react-dom'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import * as serviceWorker from './serviceWorker';
import Shifts from "./componenets/shifts";
import Shift from "./componenets/shift";
import Users from './componenets/users'
import User from './componenets/user'
import Navbar from './componenets/navbar'
import Login from './componenets/login'


const routing = (
    <div>
        <Navbar/>
        <Router>
            <div>
                <Route exact path="/" component={Login} />
                <Route exact  path="/users" component={Users}/>
                <Route path="/users/:id" component={User}/>
                <Route exact path="/shifts" component={Shifts} />
                <Route path="/shifts/:id" component={Shift}/>
                <Route path="/login" component={Login}/>
            </div>
        </Router>
    </div>
);

ReactDOM.render(
    routing,
    document.getElementById('root')
);
serviceWorker.unregister();
