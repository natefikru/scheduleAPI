import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Row, Col } from 'react-bootstrap';
import axios from 'axios'


export default class CreateShiftModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime : '',
            endTime : '',
            users : this.props.users,
            selectedUser : "Choose User",
            selectedUserId : ''
        }
    }


    handleSubmit = event => {
        try {
            const response = axios.post(
                'http://localhost:5000/shift',
                {
                    user_id: this.state.selectedUserId,
                    start_time: this.state.startTime,
                    end_time: this.state.endTime
                });
        } catch (e) {
            console.log(`error: ${e}`);
        }
        this.props.onHide();
    };

    onChange = (e) => {
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
        const { startTime, endTime, selectedUser } = this.state;
        return (
            <div>
                <Modal.Header closeButton onClick={this.props.onHide}>
                    <Modal.Title>Create Shift</Modal.Title>
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
                        <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </div>
        )
    }
};