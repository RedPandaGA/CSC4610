import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, updateEdge, addEdge } from 'reactflow';
import { Box } from '@mui/material'
import 'reactflow/dist/style.css'
import './flowchart.css'
import axios from 'axios'
import Navbar from './navbar'


const getScheduleURL = process.env.NODE_ENV === 'production' ? '/getUserSchedule' : 'http://localhost:3002/api/getUserSchedule'

function FlowchartPage(){
    const token = JSON.parse(localStorage.getItem('udata')).token
    const uid = JSON.parse(localStorage.getItem('udata')).userId

    //const [newnodes, setNewNodes] = useState([])
    const [schedule, setSchedule] = useState([])
    const flowKey = 'example-flow';
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
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

    useEffect(() => {
        getUserSchedule()
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
        console.log(newnodes)
        setNodes(newnodes)
        console.log(nodes)
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

    const onSave = useCallback(() => {
        if (rfInstance) {
          const flow = rfInstance.toObject();
          localStorage.setItem(flowKey, JSON.stringify(flow));
        }
      }, [rfInstance]);

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
                        <button onClick={onSave}>save</button>
                    </div>
                    <Background />
                    <Controls />
                </ReactFlow>
            </Box>
        </div>
    )
}

export default FlowchartPage