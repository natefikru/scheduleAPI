import React from 'react'
import axios from "axios";

export default class Shift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shift: {}
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/shift/' + this.props.shiftId)
            .then(res => res.json())
            .then((data) => {
                this.setState({shift: data});
            })
            .catch(console.log)

    }

    deleteShift = () => {
        try {
            const response = axios.delete(
                `http://localhost:5000/shift/${this.state.shift.id}`
            ).then(() => {
                window.location.reload();
            });
        } catch (e) {
            console.log(`error: ${e}`);
        }
    };


    render() {
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
                    <button type="button" className="btn btn-danger" onClick={this.deleteShift}>Delete Shift</button>
                    <button type="button" className="btn btn-info">Edit Shift</button>
                </div>
            </div>
        )
    }
};