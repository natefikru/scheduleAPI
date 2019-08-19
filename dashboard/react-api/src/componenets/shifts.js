import React from 'react'
import CreateShiftModal from "./modals/createShift";
import Modal from 'react-bootstrap/Modal'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'

export default class Shifts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            shifts: [],
            show: false,
            users: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/users')
            .then(res => res.json())
            .then((data) => {
                this.setState({users: data})
            }).catch(console.log);

        fetch('http://localhost:5000/shifts')
            .then(res => res.json())
            .then((data) => {
                this.setState({shifts: data})
            }).catch(console.log);
    }

    showCreateShiftModal = () => {
        this.setState({ show: true });
    };

    hideCreateShiftModal = () => {
        this.setState({ show: false });
    };


    render() {
        return (
            <div id="shift-table">
                <h1>Shifts</h1>
                <table className="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th scope="col">Shift ID</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">End Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.shifts.map((shift) => (
                        <tr key={shift.id}>
                            <th scope="row"><Link to={`/shifts/${shift.id}`}>{shift.id}</Link></th>
                            <th scope="row">{shift.user_first_name} {shift.user_last_name}</th>
                            <th scope="row">{shift.start_time}</th>
                            <th scope="row">{shift.end_time}</th>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Modal show={this.state.show}>
                    <CreateShiftModal  onHide={this.hideCreateShiftModal} users={this.state.users}/>
                </Modal>
                <button type="button" className="btn btn-success" onClick={this.showCreateShiftModal}>
                    Create Shift
                </button>
            </div>
        )
    }
};