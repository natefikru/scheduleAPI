import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Row, Col } from 'react-bootstrap';
import axios from 'axios'
import {Redirect} from "react-router";


export default class EditShiftModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime : '',
            endTime : '',
            users : [],
            selectedUser : "Choose User",
            selectedUserId : '',
            shiftId : props.shiftId,
            toShifts: false
        }
    }

    componentDidMount() {
        fetch('http://localhost:5000/users')
            .then(res => res.json())
            .then((data) => {
                this.setState({users: data})
            }).catch(console.log);
    }


    handleSubmit = event => {
        try {
            const response = axios.put(
                `http://localhost:5000/shift/${this.state.shiftId}`,
                {
                    user_id: parseInt(this.state.selectedUserId),
                    start_time: parseInt(this.state.startTime),
                    end_time: parseInt(this.state.endTime)
                }).then(() => {
                this.setState({
                    toShifts: true
                })
            });
        } catch (e) {
            console.log(`error: ${e}`);
        }
        this.props.onHide();
    };

    onChange = (e) => {
        console.log(this.state)
        if (e) {
            if (typeof e.target.value === 'undefined') {
                this.setState({
                    'selectedUser' : e.target.name,
                    'selectedUserId' : e.target.id
                })
            } else {
                this.setState({
                    [e.target.name] : e.target.value,
                });
            }
        }
    };

    render() {
        const { startTime, endTime, selectedUser, toShifts } = this.state;
        if (toShifts === true) {
            return (<Redirect to='/shifts'/>)
        } else {
            return (
                <div>
                    <Modal.Header closeButton onClick={this.props.onHide}>
                        <Modal.Title>Edit Shift</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formUserSelect">
                                <DropdownButton id="dropdown-basic-button" title={selectedUser}>
                                    {this.state.users.map((user) => (
                                        <Dropdown.Item
                                            name={user.first_name + ' ' + user.last_name}
                                            id={user.id}
                                            onClick={this.onChange}
                                        >
                                            {user.first_name} {user.last_name}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formStartTime">
                                        <Form.Label>Start Time</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Start Time"
                                            name="startTime"
                                            value={startTime}
                                            onChange={this.onChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formEndTime">
                                        <Form.Label>End Time</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="End Time"
                                            name="endTime"
                                            value={endTime}
                                            onChange={this.onChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <br/>
                            <Button variant="primary" onClick={this.handleSubmit}>
                                Save Changes
                            </Button>
                        </Form>
                    </Modal.Body>
                </div>
            )
        }
    }
};