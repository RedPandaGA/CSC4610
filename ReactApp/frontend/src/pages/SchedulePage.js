import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material'
import Navbar from './navbar'

function SchedulePage(){
    var rowIndex = 0;
    const [possibleDept, setPossibleDept] = useState([])
    const [curDept, setCurDept] = useState("")
    const [schedule, setSchedule] = useState([])
    const [possible, setPossible] = useState([])
    const [toadd, setToAdd] = useState([])
    const [selected, setSelected] = useState([])

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
        //get possible dept
        var possibleDepts = ["CSC", "EE", "ENGL"]
        setPossibleDept(possibleDepts)
    }, [])

    const handlePossible = (e) => {
        setToAdd(e.target.value)
    }
    
    const handlePossibleDept = (e) => {
        setCurDept(e.target.value)
    }

    const handleSelection = (e) => {
        setSelected(e)
    }

    const handleAddto = (e) => {
        var newschedule = [...schedule]
        //console.log(toadd)
        toadd.forEach((course) => {
            course.id = newschedule[newschedule.length-1].id+1
            newschedule.push(course)
        })
        setSchedule(newschedule)
    }
    //newschedule.splice(sel, 1)
    const handleRemove = (e) => {
        
    }

    const columns = [
        {field: 'dept', headerName: 'Dept', width: 50},
        {field: 'CID', headerName: 'Course ID', width: 100},
        {field: 'sect', headerName: 'Section', width: 70 },
        {field: 'hrs', headerName: 'Credit Hours', width: 100 },
        {field: 'begin', headerName: 'Begin Time', width: 100 },
        {field: 'end', headerName: 'End Time', width: 100 },
        {field: 'days', headerName: 'Days', width: 100 },
        {field: 'location', headerName: 'Loaction', width: 100 },
        {field: 'prereq', headerName: 'Prerequirement(s)', width: 200}
    ]


    return(
        <div>
            <Navbar/>
            <Box sx={{ height: 630, width: '100%' }}>
                <DataGrid
                    rows={schedule}
                    columns={columns}
                    rowsPerPageOptions={[5,10,20,40]}
                    onSelectionModelChange={handleSelection}
                    checkboxSelection
                    autoHeight
                />
                <FormControl sx={{m: 1, width: 100}}>
                    <InputLabel>Dept</InputLabel>
                    <Select
                        value={curDept}
                        label="Course"
                        onChange={handlePossibleDept}
                    >
                        {possibleDept.map((Dept) => {
                            return(
                                <MenuItem value={Dept}>{Dept}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{m: 1, width: 300}}>
                    <InputLabel>Possible</InputLabel>
                    <Select
                        value={toadd}
                        label="Course"
                        onChange={handlePossible}
                        multiple
                    >
                        {possible.map((possibleCourse) => {
                            return(
                                <MenuItem value={possibleCourse}>{possibleCourse.dept + possibleCourse.CID}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{m: 1, width: 180}}>
                    <Button variant="contained" onClick={handleAddto}>Add To Schedule</Button>
                    <Button variant="contained" onClick={handleRemove}>Remove Selected</Button>
                </FormControl>
            </Box>
        </div>
    )
}

export default SchedulePage