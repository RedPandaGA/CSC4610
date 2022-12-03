//Import and initialize dotenv to read environment variables
import dotenv from 'dotenv'
dotenv.config()
//import our own js support libraries
import * as db from './db.js'
//import outside dependencies
import express from 'express'
import jwt from 'jsonwebtoken'
//Get environment variables
const APIkey = process.env.APIkey
const ssecret = process.env.SSECRET

var logedInRout = express.Router()

//Makes all functions in this route check to see if the request supplied a valid token
logedInRout.use((req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        res.status(200).json({success: false, message: "Error Token was not provided."})
    }
    const decodedToken = jwt.verify(token, ssecret)
    if(!decodedToken){
        return res.status(404).json({success: false, message: "Error Invalid token"})
    } else {
        console.log("success")
        next()
    }
})

logedInRout.get('/getCoursesByDept', async (req, res) => {
    const dept = req.query.dept
    const courses = await db.getCoursesByDept(dept)
    if(courses == null){
        res.status(500).send()
    } else {
        res.status(200).send(courses)
    }
})

logedInRout.get('/getUserSchedule', async (req, res) => {
    const uid = req.query.uid
    const schedule = await db.getUserSchedule(uid)
    if(schedule == null){
        res.status(500).send()
    } else {
        res.status(200).send(schedule)
    }
})

logedInRout.get('/getUserFlow', async (req, res) => {
    const uid = req.query.uid
    const flow = await db.getUserFlow(uid)
    if(flow == null){
        res.status(500).send()
    } else {
        res.status(200).send(flow)
    }
})

logedInRout.get('/getPreFlows', async (req, res) => {
    const flows = await db.getPreFlows()
    if(flows == null){
        res.status(500).send()
    } else {
        res.status(200).send(flows)
    }
})

logedInRout.get('/getPreSchedules', async (req, res) => {
    const schedules = await db.getPreSchedules()
    if(schedules == null){
        res.status(500).send()
    } else {
        res.status(200).send(schedules)
    }
})

logedInRout.post('/saveUserSchedule', async (req, res) => {
    let { scheduledata, uid } = req.body 
    const schedule = await db.saveUserSchedule(scheduledata, uid)
    if(schedule == null){
        res.status(500).send()
    } else {
        res.status(200).send()
    }
})

logedInRout.post('/saveUserFlow', async (req, res) => {
    let { flowdata, uid } = req.body 
    const schedule = await db.saveUserflow(flowdata, uid)
    if(schedule == null){
        res.status(500).send()
    } else {
        res.status(200).send()
    }
})

logedInRout.get('/getDepts', async (req, res) => {
    const depts = await db.getDepts()
    if(depts == null){
        res.status(500).send()
    } else {
        res.status(200).send(depts)
    }
})

export default logedInRout