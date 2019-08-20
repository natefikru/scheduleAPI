import React from 'react'
import { Redirect } from 'react-router'
import axios from "axios";
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import Modal from "react-bootstrap/Modal";
import EditShiftModal from "./modals/editShift";


export default class Shift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shift: {},
            shiftId : props.match.params.id,
            toShifts : "false",
            showEdit: false
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/shift/' + this.state.shiftId)
            .then(res => res.json())
            .then((data) => {
                this.setState({shift: data});
            })
            .catch(console.log)

    }

    showEditShiftModal = () => {
        this.setState({ showEdit: true });
    };

    hideEditShiftModal = () => {
        this.setState({ showEdit: false });
    };

    deleteShift = () => {
        try {
            const response = axios.delete(
                `http://localhost:5000/shift/${this.state.shift.id}`
            ).then(() => {
                this.setState({
                    toShifts: "true"
                });
            });
        } catch (e) {
            console.log(`error: ${e}`);
        }
    };


    render() {
        if (this.state.toShifts === "true") {
            return (<Redirect to='/shifts'/>)
        }
        else {
            return (
                <div>
                    <div id="shift-table">
                        <div className="card" >
                            <div className="card-body">
                                <h5 className="card-title">Shift ID: {this.state.shift.id}</h5>
                                <p className="card-text">Shift Start Time: {this.state.shift.start_time}</p>
                                <p className="card-text">Shift Start Time: {this.state.shift.end_time}</p>
                                <p className="card-text">Employee: {this.state.shift.user_first_name} {this.state.shift.user_last_name}</p>
                            </div>
                        </div>
                        <Modal show={this.state.showEdit}>
                            <EditShiftModal  onHide={this.hideEditShiftModal} shiftId={this.state.shiftId} userId={this.state.shift.user_id}/>
                        </Modal>
                        <button type="button" className="btn btn-danger" onClick={this.deleteShift}>Delete Shift</button>
                        <button type="button" className="btn btn-info" onClick={this.showEditShiftModal}>Edit Shift</button>
                    </div>
                </div>
            )
        }


    }
};