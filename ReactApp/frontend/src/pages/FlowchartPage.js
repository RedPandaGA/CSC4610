import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, updateEdge, addEdge } from 'reactflow';
import { Box, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material'
import 'reactflow/dist/style.css'
import './flowchart.css'
import axios from 'axios'
import Navbar from './navbar'


const getScheduleURL = process.env.NODE_ENV === 'production' ? '/getUserSchedule' : 'http://localhost:3002/api/getUserSchedule'
const saveFlowURL = process.env.NODE_ENV === 'production' ? '/saveUserFlow' : 'http://localhost:3002/api/saveUserFlow'
const getUserFlowURL = process.env.NODE_ENV === 'production' ? '/getUserFlow' : 'http://localhost:3002/api/getUserFlow'
const getPremadeFlowsURL = process.env.NODE_ENV === 'production' ? '/getPreFlows' : 'http://localhost:3002/api/getPreFlows'

function FlowchartPage(){
    const token = JSON.parse(localStorage.getItem('udata')).token
    const uid = JSON.parse(localStorage.getItem('udata')).userId

    //const [newnodes, setNewNodes] = useState([])
    const [schedule, setSchedule] = useState([])
    const flowKey = 'example-flow';
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
    const [premadeflows, setPremadeFlows] = useState([])
    const [selectedPremade, setSelectedPremade] = useState([])
    const edgeUpdateSuccessful = useRef(true);

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
        if(rows.length > 0){
            setSchedule(rows)
        }
    }
    
    async function getPremadeFlows(){
        await axios({
            method: 'GET',
            url: getPremadeFlowsURL,
            headers: { Authorization: `token ${token}` },
        })
        .then((res) => {
            console.log(res.data.rows)
            setPremadeFlows(res.data.rows)
        })
        .catch((err) => {
            console.log(err)
            alert("Couldn't get Premade flowcharts")
        })
    }

    useEffect(() => {
        getUserSchedule()
        getPremadeFlows()
    }, [])

    useEffect(() => {
        var numNodes = 0
        var newnodes = []
        schedule.forEach((course) => {
            let newNode = {}
            let courseName = course.dept + course.cid
            newNode.id = (courseName)
            newNode.data = { label: courseName }
            let newPositionX = numNodes * 150
            console.log(newPositionX)
            newNode.position = { x: newPositionX, y: 0 }
            numNodes++
            newnodes.push(newNode)
        })
        setNodes(newnodes)
        let newedges = []
        schedule.forEach((course) => {
            let courseName = course.dept + course.cid
            course.prereq.forEach((prereq) => {
                let newedge = {}
                newedge.source = prereq
                newedge.target = courseName
                newedge.id = courseName + "-" + prereq
                newedge.type = 'step'
                newedges.push(newedge)
            })
        })
        setEdges(newedges)
    }, [schedule])

    const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);
    
    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, []);

    async function saveUserflow(){
        const flow = rfInstance.toObject();
        const data = { flowdata: flow, uid: uid }
        await axios({
            method: 'POST',
            url: saveFlowURL,
            headers: { Authorization: `token ${token}` },
            data: data
        })
        .then((res) => {
            if(res.status == 200){
                alert("Successfully saved flowchart.")
            } else {
                alert("Failed to save flowchart.")
            }
        })
        .catch((err) => {
            console.log(err)
            alert("Failed to save flowchart. Try again later")
        })
    }

    async function loadUserflow(){
        await axios({
            method: 'GET',
            url: getUserFlowURL,
            headers: { Authorization: `token ${token}` },
            params: { uid: uid }
        })
        .then((res) => {
            console.log(res.data.rows[0].flowdata)
            let flowdata = res.data.rows[0].flowdata
            setNodes(flowdata.nodes)
            setEdges(flowdata.edges)
        })
        .catch((err) => {
            console.log(err)
            alert("Failed to fetch schedule. Try again later")
        })
    }

    function loadPremade(){
        setNodes(selectedPremade.flowdata.nodes)
        setEdges(selectedPremade.flowdata.edges)
    }

    const handleSelect = (e) => {
        setSelectedPremade(e.target.value)
    }

    // const onSave = useCallback(() => {
    //     if (rfInstance) {
    //       const flow = rfInstance.toObject();
    //       localStorage.setItem(flowKey, JSON.stringify(flow));
    //     }
    //   }, [rfInstance]);

    return(
        <div>
            <Navbar/>
            <Box sx={{ height: 969 }}>
                <ReactFlow
                     nodes={nodes}
                     edges={edges}
                     onNodesChange={onNodesChange}
                     onEdgesChange={onEdgesChange}
                     snapToGrid
                     onEdgeUpdate={onEdgeUpdate}
                     onEdgeUpdateStart={onEdgeUpdateStart}
                     onEdgeUpdateEnd={onEdgeUpdateEnd}
                     onConnect={onConnect}
                     onInit={setRfInstance}
                     fitView
                >
                    <div className="save__controls">
                        <div className="note">Try fit view button in bottom left if flowchart is blank after load</div>
                        <FormControl sx={{s: 1, width: 150}}>
                            <Button onClick={saveUserflow}>save</Button>
                            <Button onClick={loadUserflow}>LoadUser</Button>
                        </FormControl>
                        <FormControl sx={{s: 1, width: 150}}>
                            <InputLabel>Premade</InputLabel>
                            <Select
                                value={selectedPremade}
                                label="Course"
                                onChange={handleSelect}
                            >
                            {premadeflows.map((premadeflow) => {
                                return(
                                    <MenuItem value={premadeflow}>{premadeflow.flowname}</MenuItem>
                                )
                            })}
                            </Select>
                            <Button onClick={loadPremade}>LoadPremade</Button>
                        </FormControl>
                    </div>
                    <Background />
                    <Controls />
                </ReactFlow>
            </Box>
        </div>
    )
}

export default FlowchartPage