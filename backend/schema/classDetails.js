import mongoose from 'mongoose';


const classSchema = new mongoose.Schema({
    classId: {
        type: String,
        required: true,
        unique: true
    },
    roomNo: {
        type: Number,
        required: true
    },
    blockNo: {
        type: String,
        enum: ['cb', 'ab1', 'ab2'],
        required: true
    },
    floorNo: {
        type: Number,
        required: true
    },
    classType: {
        type: String,
        enum: ['class', 'lab'],
        required: true
    }
});

const ClassDetails =  mongoose.model('ClassDetails', classSchema);
export default ClassDetails;
