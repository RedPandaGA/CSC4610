import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material'
import axios from 'axios'
import Navbar from './navbar'

const courseURL = process.env.NODE_ENV === 'production' ? '/getCoursesByDept' : 'http://localhost:3002/api/getCoursesByDept'
const getScheduleURL = process.env.NODE_ENV === 'production' ? '/getUserSchedule' : 'http://localhost:3002/api/getUserSchedule'
const getDeptsURL = process.env.NODE_ENV === 'production' ? '/getDepts' : 'http://localhost:3002/api/getDepts'
const saveSchedURL = process.env.NODE_ENV === 'production' ? '/saveUserSchedule' : 'http://localhost:3002/api/saveUserSchedule'
const getPremadeFlowsURL = process.env.NODE_ENV === 'production' ? '/getPreSchedules' : 'http://localhost:3002/api/getPreSchedules'

function SchedulePage(){
    const token = JSON.parse(localStorage.getItem('udata')).token
    const uid = JSON.parse(localStorage.getItem('udata')).userId

    var rowIndex = 0;
    const [possibleDept, setPossibleDept] = useState([])
    const [curDept, setCurDept] = useState("")
    const [schedule, setSchedule] = useState([])
    const [possible, setPossible] = useState([])
    const [toadd, setToAdd] = useState([])
    const [selected, setSelected] = useState([])
    const [premadescheds, setPremadeScheds] = useState([])
    const [selectedPremade, setSelectedPremade] = useState([])

    async function getUserSchedule(){
        var rows = []
        await axios({
            method: 'GET',
            url: getScheduleURL,
            headers: { Authorization: `token ${token}` },
            params: { uid: uid }
        })
        .then((res) => {
            rows = res.data.rows[0].scheduledata
        })
        .catch((err) => {
            console.log(err)
            alert("Failed to fetch schedule. Try again later")
        })
        rowIndex = 0
        if(rows.length > 0){
            rows.forEach((row) => {
                row.id = rowIndex++
            })
        }
        if(rows.length > 0){
            setSchedule(rows)
        }
    }

    async function getPossibleDepts(){
        var possibleDepts = []
        await axios({
            method: 'GET',
            url: getDeptsURL,
            headers: { Authorization: `token ${token}` },
        })
        .then((res) => {
            possibleDepts = res.data.rows
            possibleDepts = possibleDepts.map((dept) => {
                return dept.dname
            })
        })
        .catch((err) => {
            console.log(err)
            alert("Failed to fetch schedule. Try again later")
        })
        setPossibleDept(possibleDepts)
    }

    async function getPremadeScheds(){
        await axios({
            method: 'GET',
            url: getPremadeFlowsURL,
            headers: { Authorization: `token ${token}` },
        })
        .then((res) => {
            console.log(res.data.rows)
            setPremadeScheds(res.data.rows)
        })
        .catch((err) => {
            console.log(err)
            alert("Couldn't get premade schedules")
        })
    }

    useEffect(() => {
        //get users courses
        getUserSchedule()
        //get possible dept
        getPossibleDepts()
        //get premade schedules
        getPremadeScheds()
    }, [])



    async function getPossibleCourses(dept){
        await axios({
            method: 'GET',
            url: courseURL,
            headers: { Authorization: `token ${token}` },
            params: { dept: dept }
        })
        .then((res) => {
            //console.log(res.data.rows)
            setPossible(res.data.rows)
        })
        .catch((err) => {
            console.log(err)
            alert("Failed to fetch possible courses. Try again later")
        })
    }

    useEffect(() => {
        getPossibleCourses(curDept)
    }, [curDept])

    const handlePossible = (e) => {
        setToAdd(e.target.value)
    }
    
    const handlePossibleDept = (e) => {
        setCurDept(e.target.value)
    }

    const handleSelection = (e) => {
        setSelected(e)
    }

    // useEffect(() => {
    //     console.log(selected)
    // }, [selected])

    function tableIdCheck(){
        var schedulednum = 0;
        schedule.forEach((course) => {
            schedule[schedulednum].id = schedulednum
            schedulednum++
        })
    }

    const handleAddto = (e) => {
        var newschedule = [...schedule]
        console.log(toadd)
        tableIdCheck()
        toadd.id = newschedule.length
        newschedule.push(toadd)
        setSchedule(newschedule)
        console.log(newschedule)
    }

    //newschedule.splice(sel, 1)
    const handleRemove = (e) => {
        var newschedule = [...schedule]
        selected.sort()
        selected.reverse()
        console.log(selected)
        selected.forEach((todel) => {
            tableIdCheck()
            newschedule.splice(todel, 1)
        })
        console.log(newschedule)
        setSchedule(newschedule)
    }
    
    async function saveUserSchedule(){
        const data = { scheduledata: schedule, uid: uid }
        await axios({
            method: 'POST',
            url: saveSchedURL,
            headers: { Authorization: `token ${token}` },
            data: data
        })
        .then((res) => {
            if(res.status == 200){
                alert("Successfully saved schedule.")
            } else {
                alert("Failed to save schedule.")
            }
        })
        .catch((err) => {
            console.log(err)
            alert("Failed to fetch possible courses. Try again later")
        })
    }

    const handleSave = (e) => {
        saveUserSchedule()
    }

    const handleSelect = (e) => {
        setSelectedPremade(e.target.value)
    }

    function loadPremade(){
        var rows = selectedPremade.scheduledata
        rowIndex = 0
        if(rows.length > 0){
            rows.forEach((row) => {
                row.id = rowIndex++
            })
        }
        if(rows.length > 0){
            setSchedule(rows)
        }
    }

    const columns = [
        {field: 'dept', headerName: 'Dept', width: 100},
        {field: 'cid', headerName: 'Course ID', width: 100},
        {field: 'hrs', headerName: 'Credit Hours', width: 100 },
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
                    >
                        {possible.map((possibleCourse) => {
                            return(
                                <MenuItem value={possibleCourse}>{possibleCourse.dept + possibleCourse.cid}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{m: 1, width: 180}}>
                    <Button variant="contained" onClick={handleAddto}>Add To Schedule</Button>
                    <Button variant="contained" onClick={handleRemove}>Remove Selected</Button>
                    <Button variant="contained" onClick={handleSave}>Save Schedule</Button>
                </FormControl>
                <FormControl sx={{s: 1, width: 150}}>
                    <InputLabel>Premade</InputLabel>
                    <Select
                        value={selectedPremade}
                        label="Course"
                        onChange={handleSelect}
                    >
                    {premadescheds.map((premadesched) => {
                        return(
                            <MenuItem value={premadesched}>{premadesched.schedulename}</MenuItem>
                        )
                    })}
                    </Select>
                    <Button onClick={loadPremade}>LoadPremade</Button>
                </FormControl>
            </Box>
        </div>
    )
}

export default SchedulePage