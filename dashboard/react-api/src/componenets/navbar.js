import React from 'react'


export default class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand mb-0 h1" href='/users'>
                    Schedule App
                </a>
                <div>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">

                            <a className="nav-item nav-link" href='/users'>Users</a>
                            <a onClick={this.props.showShifts} className="nav-item nav-link" href='/shifts'>Shifts</a>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
};