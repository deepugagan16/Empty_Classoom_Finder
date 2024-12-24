const mongoose = require('mongoose');


// Replace with your MongoDB connection string
const mongoURI = "mongodb+srv://deepugagan16:XBQfDBMsiX8i4c1S@cluster0.d6s31.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Define the Room schema (based on your previous request)
const roomSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming classId references another collection
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['class', 'lab'],
    required: true,
  },
  roomNo: {
    type: Number,
    required: true,
  },
});

// Create a model based on the schema
const Room = mongoose.model('Room', roomSchema);

// Function to generate random start and end times
const generateRandomTime = (isLab) => {
  const startHour = Math.floor(Math.random() * (18 - 9)) + 9; // Random hour between 9 and 18
  const endHour = isLab ? startHour + 2 : startHour + 1; // Lab duration 2 hours, class duration 1 hour
  return {
    startTime: `${startHour}:00`,
    endTime: `${endHour}:00`,
  };
};

// Main function to seed the database
const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB!');

    const entries = [];
    const blocks = ['cb', 'ab1', 'ab2'];
    const days = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 30; i++) {
      const block = blocks[Math.floor(Math.random() * blocks.length)];
      const floor = block === 'cb' ? Math.floor(Math.random() * 11) : Math.floor(Math.random() * 6); // Floors based on block
      const roomNo = block === 'cb' 
    ? Math.floor(Math.random() * (30 - 11 + 1)) + 11  // Generates roomNo between 11 and 30 for block 'cb'
    : Math.floor(Math.random() * 10) + 1;              // Generates roomNo between 1 and 10 for blocks 'ab1' and 'ab2'

      const day = days[Math.floor(Math.random() * days.length)];
      const isLab = Math.random() < 0.5; // Randomly decide if it's a lab or class
      const { startTime, endTime } = generateRandomTime(isLab);

      const classId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for classId

      entries.push({
        day,
        classId,
        startTime,
        endTime,
        floor,
        block,
        type: isLab ? 'lab' : 'class',
        roomNo,
      });
    }

    // Insert entries into the database
    await Room.insertMany(entries);
    console.log(`${entries.length} entries created successfully!`);
    
    // Close the database connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with failure
  }
};

// Call the seed function
seedDatabase();
