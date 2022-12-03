import React, { useState, useEffect } from "react";
import Navbar from './navbar'

function Home(){

    return(
        <div>
            <Navbar/>
            <div>Go to Schedule to view current schedule and add courses or select a premade schedule.</div>
            <div>Go to Flowchart to view and edit a flowchart or load a premade one.</div>
        </div>

    )
}

export default Home