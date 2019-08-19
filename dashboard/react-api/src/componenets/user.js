import React from 'react'
import CreateShiftModal from "./modals/createShift";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import {forEach} from "react-bootstrap/es/utils/ElementChildren";


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
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/user/' + this.props.userId)
            .then(res => res.json())
            .then((data) => {
                this.setState({user: data});
                this.setState({users : [data]})
            })
            .catch(console.log)
        fetch('http://localhost:5000/user/' + this.props.userId + '/shifts')
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

    deleteUser = () => {
        try {
            forEach(this.state.shifts.forEach((shift) => {
                console.log(shift)
                if (shift.user_id === this.state.user.id) {
                    const response = axios.delete(
                        `http://localhost:5000/shift/${shift.id}`
                    )
                }
            }));
            const response = axios.delete(
                `http://localhost:5000/user/${this.state.user.id}`
            ).then(() => {
                window.location.reload();
            });
        } catch (e) {
            console.log(`error: ${e}`);
        }
    };

    render() {
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
                    <button type="button" className="btn btn-info">Edit User</button>
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
                            <th scope="row">{shift.id}</th>
                            <th scope="row">{shift.start_time}</th>
                            <th scope="row">{shift.end_time}</th>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Modal show={this.state.show}>
                    <CreateShiftModal  onHide={this.hideCreateShiftModal} users={this.state.users}/>
                </Modal>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.showCreateShiftModal}
                >
                    Create Shift
                </button>
            </div>
        )
    }
};