import React, { useState, useEffect } from "react";
import './navbar.css'

function Navbar(){

    const handleLogout = () => {
        localStorage.clear()
        window.location.replace('/')
    }

    return(
        <div classname="navbar">
            <nav>
                <ul>
                    <li>
                        <a href="/Home">Home</a>
                    </li>
                    <li>
                        <a href="/Schedule">Schedule</a>
                    </li>
                    <li>
                        <a href="/Flowchart">Flowchart</a>
                    </li>
                    <li>
                        <a href="/Account">Account</a>
                    </li>
                </ul>
                <button onClick={handleLogout}>Logout</button>
            </nav>
        </div>
    )
}

export default Navbar