import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // New state for success message
  const navigate = useNavigate();

  // const helper = () => {
  //   setTimeout(() => {
  //     navigate('/classrooms');
  //   }, 2000);
  // }

  const addSchedule = async () => {
     // Fetch localStorage data
     let parsedData;
        const dataPass = localStorage.getItem('classroom');
        if (dataPass) {
          parsedData = JSON.parse(dataPass);
          // console.log('parsedData', parsedData);
          // console.log('classroom ID:', parsedData.classroom._id);
        } else {
          console.log('No classroom data found in localStorage.');
        }

        const classId = parsedData.classId;
        const startTime = localStorage.getItem('startTime');
        const endTime = localStorage.getItem('endTime');
        const day = localStorage.getItem('day');
        console.log(classId,startTime,endTime,day)


        if (classId && startTime && endTime && day) {

          const response2 = await fetch('http://localhost:4000/add-schedule', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              classId,
              startTime,
              endTime,
              day,
            }),
          });

          const data2 = await response2.json();
          setMessage('Class Scheduled');
          setTimeout(() => {
            navigate('/classrooms');
      }, 2000);
          console.log('Schedule data:', data2);
        } else {
          console.log('Missing data for schedule in localStorage');
        }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Login request
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
          await addSchedule();
      }else{
        setMessage("Invalid Credentials")
      }
    } catch (error) {
      setMessage("Invalid Credentials")
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-500 font-semibold">{message}</p>
        )}

      </div>
    </div>
  );
}

export default Login;
