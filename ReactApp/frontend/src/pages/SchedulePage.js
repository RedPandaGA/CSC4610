import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material'
import Navbar from './navbar'

function SchedulePage(){
    var rowIndex = 0;
    const [schedule, setSchedule] = useState([])
    const [possible, setPossible] = useState([])

    useEffect(() => {
        //get users courses
        var rows = [
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'},
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MTWTHF', location: 'PFT'}
        ]
        rowIndex = 0
        rows.forEach((row) => {
            row.id = rowIndex++
        })
        setSchedule(rows)
        //get possible courses
        var possibleCourses = [
            {dept: "CSC", CID: 4610, sect: 1, hrs: 3, begin: 1200, end: 300, days: 'MW', location: 'PFT'},
            {dept: "CSC", CID: 4444, sect: 1, hrs: 3, begin: 1030, end: 1200, days: 'TTH', location: 'PFT'}
        ]
        setPossible(possibleCourses)
    }, [])

    const columns = [
        {field: 'dept', headerName: 'Dept', width: 50},
        {field: 'CID', headerName: 'Course ID', width: 100},
        {field: 'sect', headerName: 'Section', width: 70 },
        {field: 'hrs', headerName: 'Credit Hours', width: 100 },
        {field: 'begin', headerName: 'Begin Time', width: 100 },
        {field: 'end', headerName: 'End Time', width: 100 },
        {field: 'days', headerName: 'Days', width: 100 },
        {field: 'location', headerName: 'Loaction', width: 100 }
    ]


    return(
        <div>
            <Navbar/>
            <Box sx={{ height: 630, width: '100%' }}>
                <DataGrid
                    rows={schedule}
                    columns={columns}
                    rowsPerPageOptions={[5,10,20,40]}
                    autoHeight
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Box>
        </div>
    )
}

export default SchedulePage