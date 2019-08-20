import React from 'react'
import CreateShiftModal from "./modals/createShift";
import EditUserModal from "./modals/editUser"
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import { Redirect } from 'react-router'
import {forEach} from "react-bootstrap/es/utils/ElementChildren";
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'

let apiHost = `http://${process.env.REACT_APP_API_HOST}`;


export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                'first_name' : '',
                'last_name' : '',
                'email' : '',
                'id' : ''
            },
            users: [],
            shifts: [],
            show: false,
            showEdit: false,
            userId : props.match.params.id,
            toUsers : "false"
        };
    }

    componentDidMount() {
        fetch(`${apiHost}/user/${this.state.userId}`)
            .then(res => res.json())
            .then((data) => {
                this.setState({user: data});
                this.setState({users : [data]})
            })
            .catch(console.log)
        fetch(`${apiHost}/user/${this.state.userId}/shifts`)
            .then(res => res.json())
            .then((data) => {
                this.setState({shifts: data});
            })
            .catch(console.log)
    }

    showCreateShiftModal = () => {
        this.setState({ show: true });
    };

    hideCreateShiftModal = () => {
        this.setState({ show: false });
    };

    showEditUserModal = () => {
        this.setState({ showEdit: true });
    };

    hideEditUserModal = () => {
        this.setState({ showEdit: false });
    };

    deleteUser = () => {
        try {
            forEach(this.state.shifts.forEach((shift) => {
                if (shift.user_id === this.state.user.id) {
                    const response = axios.delete(
                        `${apiHost}/shift/${shift.id}`
                    )
                }
            }));
            const response = axios.delete(
                `${apiHost}/user/${this.state.user.id}`
            ).then(() => {
                this.setState({
                    toUsers: "true"
                });
            });
        } catch (e) {
            console.log(`error: ${e}`);
        }
    };

    render() {
        if (this.state.toUsers === "true") {
            return (<Redirect to='/users'/>)
        } else {
            return (
                <div id="user-table">
                    <div>
                        <div className="card" >
                            <div className="card-body">
                                <h5 className="card-title">{this.state.user.first_name} {this.state.user.last_name}</h5>
                                <p className="card-text">User ID: {this.state.user.id}</p>
                                <p className="card-text">Email: {this.state.user.email}</p>
                            </div>
                        </div>
                        <button type="button" className="btn btn-danger" onClick={this.deleteUser}>Delete User</button>
                        <button type="button" className="btn btn-info" onClick={this.showEditUserModal}>Edit User</button>
                    </div>
                    <br/>
                    <h3>Shifts</h3>
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr>
                            <th scope="col">Shift ID</th>
                            <th scope="col">Start Time</th>
                            <th scope="col">End Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.shifts.map((shift) => (
                            <tr key={shift.id} onClick={this.props.showShift}>
                                <th scope="row"><Link to={`/shifts/${shift.id}`}>{shift.id}</Link></th>
                                <th scope="row">{shift.start_time}</th>
                                <th scope="row">{shift.end_time}</th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Modal show={this.state.show}>
                        <CreateShiftModal  onHide={this.hideCreateShiftModal} users={this.state.users}/>
                    </Modal>
                    <Modal show={this.state.showEdit}>
                        <EditUserModal  onHide={this.hideEditUserModal} userId={this.state.userId}/>
                    </Modal>
                    <button type="button" className="btn btn-success" onClick={this.showCreateShiftModal}>
                        Create Shift
                    </button>
                </div>
            )
        }
    }
};