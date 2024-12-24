import ClassDetails from './classDetails.js';
import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassDetails',
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    day:{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
    },
    // expiresAt: { 
    //     type: Date,
    //     default: undefined // Allows setting this dynamically from the controller
    // }
});

scheduleSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;