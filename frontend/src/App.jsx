// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import ClassroomFinder from './pages/ClassroomFinder';
import Login from './pages/Login';


function App() {
  return (
    <Router>
      <nav>
        {/* <Link to="/">Home</Link>
        <Link to="/classrooms">Classroom Finder</Link>
        <Link to="/login"> Login </Link> */}

      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classrooms" element={<ClassroomFinder />} />
        <Route path='/login' element={<Login/>} /> 

      </Routes>
    </Router>
  );
}

export default App;
