import React from 'react'
import CreateUserModal from "./modals/createUser";
import Modal from 'react-bootstrap/Modal'
import {Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import {Redirect} from "react-router";

let apiHost = `http://${process.env.REACT_APP_API_HOST}`;



export default class Users extends React.Component {

    constructor(props) {
        super(props);
        let isLoggedIn;
        if (typeof this.props.location === 'undefined'){
            isLoggedIn = false
        }
        else {
            isLoggedIn = true
        }
        this.state = {
            users: [],
            show: false,
            isLoggedIn: isLoggedIn
        };
        console.log(this.state)
    }

    showCreateUserModal = () => {
        this.setState({show: true});
    };

    hideCreateUserModal = () => {
        this.setState({show: false});
    };


    componentDidMount() {
        fetch(`${apiHost}/users`)
            .then(res => res.json())
            .then((data) => {
                this.setState({users: data})
            }).catch(console.log);
    }

    render() {
        if (this.state.isLoggedIn === false) {
            return (<Redirect to='/login'/>)
        } else {
            return (
                <div id="user-table">
                    <h1>Users</h1>
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr>
                            <th scope="col">User ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Is Manager</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map((user) => (
                            <tr key={user.id}>
                                <th scope="row">{user.id}</th>

                                <td><Link to={`/users/${user.id}`}>{user.first_name} {user.last_name}</Link></td>
                                <td>{user.email}</td>
                                <td>{user.is_manager.toString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Modal show={this.state.show}>
                        <CreateUserModal onHide={this.hideCreateUserModal}/>
                    </Modal>
                    <button type="button" className="btn btn-success" onClick={this.showCreateUserModal}>
                        Create User
                    </button>
                </div>

            )
        }
    }
};