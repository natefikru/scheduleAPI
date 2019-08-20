import React from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'
import { Row, Col } from 'react-bootstrap';
import axios from 'axios'


export default class CreateUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName : '',
            lastName : '',
            email : '',
            isManager : false
        }
    }


    handleSubmit = event => {
        try {
            const response = axios.post(
                'http://localhost:5000/user',
                {
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    email: this.state.email,
                    is_manager: this.state.isManager,

                }).then(() => {
                    window.location.reload();
            });
        } catch (e) {
            console.log(`error: ${e}`);
        }
        this.props.onHide();
    };

    onChange = (e) => {
        if (e) {
            if (e.target.name === 'isManager') {
                this.setState({
                    'isManager' : e.target.checked
                })
            }
            else {
                this.setState({
                    [e.target.name] : e.target.value,
                });
            }
        }

    };

    render() {
        const { firstName, lastName, email, isManager } = this.state;
        return (
            <div>
                <Modal.Header closeButton onClick={this.props.onHide}>
                    <Modal.Title>Create User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="formUserFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="First Name"
                                        name="firstName"
                                        value={firstName}
                                        onChange={this.onChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formUserLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        name="lastName"
                                        value={lastName}
                                        onChange={this.onChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={email}
                                onChange={this.onChange}
                            />
                        </Form.Group>
                        <Form.Check
                            type='checkbox'
                            label={'Manager'}
                            id={'custom-checkbox'}
                            name="isManager"
                            checked={isManager}
                            onChange={this.onChange}
                        />
                        <br/>
                        <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </div>
        )
    }
};