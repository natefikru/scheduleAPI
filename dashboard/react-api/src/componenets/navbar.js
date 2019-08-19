import React from 'react'

export default class Navbar extends React.Component {
    render(){
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <span className="navbar-brand mb-0 h1" href="#">Schedule App</span>
                <div>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a onClick={this.props.showUsers} className="nav-item nav-link" href="#">Users</a>
                            <a onClick={this.props.showShifts} className="nav-item nav-link" href="#">Shifts</a>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
};