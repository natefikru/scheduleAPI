import React from 'react'
import CreateUserModal from "./modals/createUser";
import Modal from 'react-bootstrap/Modal'


export default class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            show : false
        };

    }

    showCreateUserModal = () => {
        this.setState({ show: true });
    };

    hideCreateUserModal = () => {
        this.setState({ show: false });
    };


    componentDidMount() {
        fetch('http://localhost:5000/users')
            .then(res => res.json())
            .then((data) => {
                this.setState({users: data})
            }).catch(console.log);
    }
    render() {
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
                        <tr key={user.id} onClick={()=>this.props.showUser(user.id)}>
                            <th scope="row">{user.id}</th>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.is_manager.toString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Modal show={this.state.show}>
                    <CreateUserModal  onHide={this.hideCreateUserModal} />
                </Modal>
                <button  type="button" className="btn btn-success" onClick={this.showCreateUserModal}>
                    Create User
                </button>
            </div>

        )
    }
};