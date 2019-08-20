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
            selectedUser : "Choose User",
            selectedUserId : this.props.userId,
            shiftId : props.shiftId,
            toShifts: false
        }
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