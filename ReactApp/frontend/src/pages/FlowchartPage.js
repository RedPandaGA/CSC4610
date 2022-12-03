import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, updateEdge, addEdge } from 'reactflow';
import { Box } from '@mui/material'
import 'reactflow/dist/style.css'
import './flowchart.css'
import Navbar from './navbar'



function FlowchartPage(){
    
    var rows = [
            {dept: "CSC", CID: '1350', hrs: 3 },
            {dept: "CSC", CID: '1351', hrs: 3 },
            {dept: "CSC", CID: '3102', hrs: 3 },
            {dept: "CSC", CID: '2259', hrs: 3 },
            {dept: "CSC", CID: '2262', hrs: 3 },
            {dept: "CSC", CID: '3380', hrs: 3 },
            {dept: "CSC", CID: '3501', hrs: 3 },
            {dept: "CSC", CID: '4330', hrs: 3 },
            // {dept: "CSC", CID: '2000+', hrs: 3 },
            // {dept: "CSC", CID: '2000+', hrs: 3 },
            {dept: "CSC", CID: '4103', hrs: 3 },
            {dept: "CSC", CID: '4101', hrs: 3 },
            {dept: "CSC", CID: '3200', hrs: 3 },
            // {dept: "CSC", CID: '4000+', hrs: 3 },
            // {dept: "CSC", CID: '4000+', hrs: 3 },
            // {dept: "CSC", CID: '3000+', hrs: 3 },
            {dept: "MATH", CID: '1550', hrs: 3 },
            {dept: "MATH", CID: '1552', hrs: 3 },
            {dept: "MATH", CID: '2090', hrs: 3 },
            {dept: "IE", CID: '3302', hrs: 3 },
            {dept: "ENGL", CID: '1001', hrs: 3 },
            // {dept: "ENGL", CID: 'GENED', hrs: 3 },
            {dept: "ENGL", CID: '2000', hrs: 3 },
            // {dept: "CMST", CID: 'GENED', hrs: 3 },
    ]

    useEffect(() => {
        
    }, [])

    var initialNodes = []

    useEffect(() => {
        var numNodes = 0;
        rows.forEach((course) => {
            let newNode = {}
            let courseName = course.dept + course.CID
            newNode.id = (courseName)
            newNode.data = { label: courseName }
            let newPositionX = numNodes * 150
            console.log(newPositionX)
            newNode.position = { x: newPositionX, y: 0 }
            numNodes++
            initialNodes.push(newNode)
        })
    }, [])

    const initialEdges = [];

    const flowKey = 'example-flow';
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const edgeUpdateSuccessful = useRef(true);
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