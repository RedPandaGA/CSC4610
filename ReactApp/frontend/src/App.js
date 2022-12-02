import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/home'
import SchedulePage from './pages/SchedulePage'
import FlowchartPage from './pages/FlowchartPage'
import Account from './pages/account'
import Login from './pages/Login'



function App() {
  return (
    <div className="App">
        <Routes>
            <Route index element={<Login/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/Schedule" element={<SchedulePage/>}/>
            <Route path="/Flowchart" element={<FlowchartPage/>}/>
            <Route path="/Account" element={<Account/>}/>
        </Routes>
    </div>
  );
}

export default App;
