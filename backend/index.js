import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import mongoose from 'mongoose';
import Schedules from './schema/schedule.js';
import ClassDetails from './schema/classDetails.js';
import User from './schema/user.js';
mongoose.connect("mongodb+srv://gagan:gagan@cluster0.pe8jo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => { 
    console.error('Error connecting to MongoDB:', error);
});

app.get('/',(req,res) => {
    console.log('hello');
    res.json({hello: "asdfasdf"})
  })
  
  
app.post('/login', async(req,res) => {
    console.log(req.body);
    
        const user = await User.findOne(req.body);
        console.log("user",user);
        if(user){
            // if(!user.access && user.access == "teacher"){
                return res.json({status: "success", user})
            // }
            // else {
                // return res.json({status: "not authneticated"})
            // }
        
        }else{
            return res.json({status: "wrong credentials"})
        }
})

app.post('/user', async(req,res) => {
    const user = await User.create(req.body);
    console.log(user);
    return res.json({user : user});
})

  


app.post('/add-class', async(req, res) => {
    const {classId, roomNo, blockNo, floorNo, classType} = req.body;
    const newClass = new ClassDetails({
        classId,
        roomNo,
        blockNo,
        floorNo,
        classType
    })
    await newClass.save();
    res.json(newClass);
});

app.post('/add-schedule', async (req, res) => {
    let { classId, startTime, endTime, day } = req.body;
    day = day.toLowerCase();

    // Find class by classId (String) and get its ObjectId
    const classDoc = await ClassDetails.findOne({ classId });
    console.log('asdf',classDoc);

    let expirationTime = 0;
    if (!classDoc) {
        return res.status(404).json({ error: 'Class not found' });
    }
    if(classDoc.roomType == 'lab') expirationTime = 7200000;
    if(classDoc.roomType == 'class') expirationTime = 3600000;
    const newSchedule = new Schedules({
        classId: classDoc._id, // Use the ObjectId from ClassDetails
        startTime,
        endTime,
        day,
        // expiresAt: expirationTime
    });

    try {
        await newSchedule.save();
        res.json(newSchedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.post('/free-rooms', async(req, res) => {
    console.log("asdf",req.body);
    let {block,floor,startTime,endTime, roomType , day, roomNo} = req.body;
    day = day.toLowerCase();
    console.log(day);


    const validQuery = {};
    const classFindQuery = {};
    if(block){
        classFindQuery.blockNo = block.toLowerCase()
    }
    if(floor || floor === 0){
        classFindQuery.floorNo = floor;
    }
    if(roomType){
        classFindQuery.classType = (roomType == "classroom") ? "class" : "lab";
    }
    if(roomNo){
        classFindQuery.roomNo = roomNo;
    }

    if(startTime){
        validQuery.startTime = startTime;
    }
    if(endTime){
        validQuery.endTime = endTime;
    }
    if(day) {
        validQuery.day = day.toLowerCase();
    }
    console.log("valid query", validQuery);
    console.log(classFindQuery);
    const classes = await ClassDetails.find(classFindQuery);
    const classIds = classes.map((c1) => c1._id);
    console.log(classIds);
    const ans = [];
    console.log(validQuery);
    
    await Promise.all(
        classIds.map(async (c) => {
            const schedules = await Schedules.find({
                classId: c,
                $or: [
                    {
                        $and: [
                            {startTime: {$gt: startTime}},
                            {startTime: {$lt: endTime}}
                        ]
                    },
                    {
                        $and: [
                            {endTime: {$gt: startTime}},
                            {endTime: {$lt: endTime}}
                        ]
                    },
                    {
                        startTime : startTime
                    },
                    {
                        endTime : endTime
                    }
                ],
                day: day
            });

            console.log(c, schedules);
            console.log(schedules.length);
            if (schedules.length === 0) {
                console.log('No schedules found for this class');
                ans.push(c);
                console.log(ans.length, "Added to ans");
            }
        })
    );

    let classDetails = [];
    await Promise.all(
        ans.map(async (c) => {
            let classD = await ClassDetails.findById(c);
            classDetails.push(classD);

        })
    );


    return res.json({ classDetails });
});


app.post('/create-schedule', async(req, res) => {
    const {classId, startTime, endTime, day} = req.body;
    const newSchedule = new Schedules({
        classId,
        startTime,
        endTime,
        day
    });
    await newSchedule.save();
    res.json(newSchedule);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(4000, () => {
    console.log('Server started on http://localhost:4000');
});