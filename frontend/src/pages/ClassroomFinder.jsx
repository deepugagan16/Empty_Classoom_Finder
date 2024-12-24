import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ClassroomFinder() {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState('');
  const [formDetails, setFormDetails] = useState({
    roomType: '',
    day: '',
    timeSlot: '',
    blockType: '',
    floor: '',
  });


  const getCurrentDateTime = () => {
    const now = new Date();

    
    // Format date as YYYY-MM-DD
    const formattedDate = now.toISOString().split('T')[0];
    
    // Format timee as HH:MM (24-hour format)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()]; 
    return { formattedDate, formattedTime , currentDay};
  };

  const handleBookNow = (classroom) => {
    console.log(classroom);
    localStorage.setItem('classroom', JSON.stringify( classroom ));
    navigate('/login');

  };



  

  useEffect(() => {
    setInterval(() => {
      setError("");
    },2000)
  },[setError])

  // useEffect(() => {
  //   const {formattedDate,formattedTime,currentDay} = getCurrentDateTime();
  //   console.log(formattedDate);
  //   console.log(formattedTime);
  //   console.log(currentDay);

    
  // },[formDetails.roomType])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };



  const onSubmit = async () => {
  const { day, blockType, floor, timeSlot, roomType } = formDetails;
  
  if (!roomType || !day || !timeSlot) {
    setError('Please fill in all required fields.');
    return;
  }
  
  // Parse the time slot to get startTime and endTime
  const [start, end] = timeSlot.split('-').map(time => time.trim());
  
  // Save startTime and endTime in localStorage
  localStorage.setItem('startTime', `${start}:00`);
  localStorage.setItem('endTime', `${end}:00`);
  localStorage.setItem('day', day.toLowerCase());

  setClassrooms([]);
  try {
    const response = await fetch('http://localhost:4000/free-rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomType, 
        day,
        startTime: `${start}:00`,
        endTime: `${end}:00`,
        roomNo: formDetails.roomType === 'lab' ? undefined : formDetails.roomNo, // RoomNo optional based on type
        block: blockType,
        floor: String(floor),
      }),
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      setClassrooms(data.classDetails);
    } else {
      setError(data.message || 'No available classes found');
    }
  } catch (error) {
    console.error('Error:', error);
    setError('An error occurred while fetching available classes.');
  }
};


  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-center text-white bg-blue-900 w-full py-4 mb-6">
        VIT-AP
      </h1>
      <p className='text-2xl font-bold'>
        Empty Rooms Finder 
      </p>

      <div className="w-full max-w-lg bg-white shadow-md rounded p-6">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Room Type <span className='text-red-600'>*</span></label>
            <select 
              name="roomType" 
              value={formDetails.roomType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded required focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Room Type</option>
              <option value="classroom">Classroom</option>
              <option value="lab">Lab</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Day <span className='text-red-600'>*</span></label>
            <select 
              name="day" 
              value={formDetails.day}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded required focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Day</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>

              {/* Add more days if needed */}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Time Slot <span className='text-red-600'>*</span></label>
            <select 
              name="timeSlot" 
              value={formDetails.timeSlot}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded required focus:outline-none focus:ring-2 focus:ring-blue-500"
            >{
              formDetails.roomType === 'classroom' ? (
                <>
                 <option value="">Select Time Slot</option>
              <option value="8-9">8 AM - 9 AM</option>
              <option value="9-10">9 AM - 10 AM</option>
              <option value="10-11">10 AM - 11 AM</option>
              <option value="11-12">11 AM - 12 PM</option>
              <option value="12-13">12 PM - 1 PM</option>
              <option value="13-14">1 PM - 2 PM</option>
              <option value="14-15">2 PM - 3 PM</option>
              <option value="15-16">3 PM - 4 PM</option>v
              <option value="16-17">4 PM - 5 PM</option>
              <option value="17-18">5 PM - 6 PM</option>
              </>
              ): 
              (
                <>
                  <option value="">Select Time Slot</option>
                  <option value="9-11">9 AM - 11 AM</option>
                  <option value="11-13">11 AM - 1 PM</option>
                  <option value="14-16">2 PM - 4 PM</option>
                  <option value="16-18">4 PM - 6 PM</option>
                  <option value="18-20">6 PM - 8 PM</option>
                </>
                )
            }


              {/* Add more time slots if needed */}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Block Type</label>
            <select 
              name="blockType" 
              value={formDetails.blockType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Block</option>
              <option value="CB">CB</option>
              <option value="AB1">AB1</option>
              <option value="AB2">AB2</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Floor</label>
            <select 
              name="floor" 
              value={formDetails.floor}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {
                formDetails.blockType === 'CB' ? (
                  <>
                    <option value="">Select Floor</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </>
                ) : formDetails.blockType === 'AB1' ? (
                  <>
                    <option value="">Select Floor</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </>
                ) : (
                  <>
                    <option value="">Select Floor</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </>
                )
              }
            </select>
          </div>

          {/* Display error message */}
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onSubmit}
              className="bg-green-500 text-white py-4  text-lg px-4 rounded hover:bg-green-600 w-full"
            >
              CHECK AVAILABILITY NOW
            </button>
        
          </div>
        </form>
      </div>

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Available Classrooms</h2>
       
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">Block</th>
              <th className="py-2 px-4 border-b text-left">Floor</th>
              <th className="py-2 px-4 border-b text-left">Room Number</th>
              <th className="py-2 px-4 border-b text-left">Room Type</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {classrooms && classrooms.map((classroom, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{classroom.blockNo}</td>
                <td className="py-2 px-4 border-b">{classroom.floorNo}</td>
                <td className="py-2 px-4 border-b">{classroom.roomNo}</td>
                <td className="py-2 px-4 border-b">{classroom.classType}</td>
                <td className="py-2 px-4 border-b">
                  <button className='bg-purple-500 p-2 rounded-md text-white'>
                    <div onClick={() => { handleBookNow(classroom) }}>
                      Book Now
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </div>
  );
}

export default ClassroomFinder;
