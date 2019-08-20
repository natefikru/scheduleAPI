import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import {Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import axios from "axios";
import sha256 from "js-sha256"
import {Redirect} from "react-router";


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoggedIn: false
        };
    };

    onChange = (e) => {
        if (e) {
            this.setState({
                [e.target.name]: e.target.value,
            });
        }
    };

    handleSubmit = (e) => {
        try {
            const response = axios.post(
                `http://localhost:5000/login`,
                {
                    password: sha256(this.state.password),
                    email: this.state.email
                }).then((response) => {
                if (response.status === 200) {
                    this.setState({
                        isLoggedIn: true
                    })
                }
            });
        } catch (e) {
            console.log(`error: ${e}`);
        }
    };

    render() {
        if (this.state.isLoggedIn === true) {
            return (<Redirect
                to={{
                    pathname: '/users',
                    isLoggedIn: this.state.isLoggedIn
                }}
            />)
        } else {
            return (
                <div id="login_form">
                    <br/>
                    <br/>
                    <Form id="form" method="post">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control name="email" onChange={this.onChange} type="email" placeholder="Enter email"/>
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password" onChange={this.onChange} type="password"
                                          placeholder="Password"/>
                        </Form.Group>
                        <Button onClick={this.handleSubmit} variant="primary">
                            Submit
                        </Button>
                    </Form>
                </div>
            )
        }

    }
};

