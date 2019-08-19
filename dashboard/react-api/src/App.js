import React, {Component} from 'react';
import './App.css';
import Users from './componenets/users'
import User from './componenets/user'
import Shifts from './componenets/shifts'
import Shift from './componenets/shift'
import Navbar from './componenets/navbar'

class App extends Component {
    constructor(props) {
        super(props);
        this.showShifts = this.showShifts.bind(this);
        this.showShift = this.showShift.bind(this);
        this.showUsers = this.showUsers.bind(this);
        this.showUser = this.showUser.bind(this);
    }
    state = {
        users: [],
        shifts:[],
        showUsers: true,
        selectedUserId: null,
        showShifts: false,
        selectedShiftId: null
    };

    showUser(userId){
        this.setState({
            showUsers: false,
            showShifts: false,
            selectedUserId: userId,
            selectedShiftId: null
        })
    }

    showUsers(){
        this.setState({
            showUsers: true,
            showShifts: false,
            selectedUserId: null,
            selectedShiftId: null
        })
    }

    showShifts(){
        this.setState({
            showUsers: false,
            showShifts: true,
            selectedUserId: null,
            selectedShiftId: null
        })
    }

    showShift(){
        this.setState({
            showUsers: false,
            showShifts: false,
            selectedUserId: null,
            selectedShiftId: 1
        })
    }


    render () {
        let content;
        if (this.state.showUsers) {
            content = <Users showUser={this.showUser}/>
        } else if (this.state.showShifts) {
            content = <Shifts showShift={this.showShift} shifts={this.state.shifts}/>
        } else if (this.state.selectedUserId) {
            content = <User userId={this.state.selectedUserId}/>
        } else if (this.state.selectedShiftId) {
            content = <Shift shiftId={this.state.selectedShiftId}/>
        }

        return (
            <div>
                <Navbar showShifts={this.showShifts} showUsers={this.showUsers}/>
                {content}
            </div>
        )
    }
}

export default App;