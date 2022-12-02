import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import axios from 'axios'
import './Login.css'
import { InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';


function Login(){
    // variables to keep track of user entered password, username, and emails
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")

    // show password on login page 
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    async function Logincall(email, password){
        const data = { email: email, password: password }
        window.location.replace('/home')
      }
      
      // enters user in database if user is not already in database
      async function signupCall(username, email, password){
        const data = { username: username, email: email, password: password }

      }

    return(
        <div className="login-page">
        
        {/*Left Section: Login Part of the Page */}
        
            <div className="left-section">      
                <div className="boxL">
                <h1 className="titleL">Login Below</h1>
                    <div className="login-form-container">
                        <h4 className="header2left">Flowchart Generator for students! </h4>
                        <h4 className="header2left" >Get organized!</h4>
                            <form className="login-from">
                            <div><input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/></div>
                            <div className="passwordField"><TextField sx={{ width:390}} variant="standard" type={showPassword?"text":"password"} placeholder="Password" value={password} onChange={p => setPassword(p.target.value)}
                            InputProps={{ // <-- This is where the toggle button is added.
                            disableUnderline: true,
                                endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                                )
                            }}
                            />
                            </div> 
                            <div><input className= "buttonL"type="button" value="Login" onClick={() => {Logincall(email, password)}}/> </div>
                            </form>
                    </div>
                    </div>
            </div>

            {/*Right Section: Sign Up Part of the Page */}

            <div className="right-section">
            <div className="boxL">
                <h1 className="titleL">Sign Up Today</h1>
                <div className="signup-form-container">
                        <h2 className="header2L">Don't have an account?</h2>
                        <h4 className="header2right">Enter your information below</h4>
                        <h4 className="header2right">to create an account!</h4>
                        <form className="signup-from">
                        <input type="text" placeholder="Username" value={username} onChange={u => setUsername(u.target.value)}/>
                        <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                        {/* show password feature --> visibility*/}
                        <TextField sx={{ width:390}} variant="standard" type={showPassword?"text":"password"} placeholder="Password" value={password} onChange={p => setPassword(p.target.value)}
                        InputProps={{ // <-- This is where the toggle button is added.
                            disableUnderline: true,
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                        <input className= "buttonL" type="button" value="Submit" onClick={() => {signupCall(username, email, password)}}/>    
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login