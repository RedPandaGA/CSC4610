import React, { useState, useEffect } from "react";
import './navbar.css'

function Navbar(){

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
            </nav>
        </div>
    )
}

export default Navbar