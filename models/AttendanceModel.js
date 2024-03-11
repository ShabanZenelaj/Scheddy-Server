import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    date: {
        type: String,
        required: [true, "Date is required"],
        unique: false,
    },
    time: {
        type: Array,
        required: [true, "Your username is required"],
        unique: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
        unique: false
    },
});

export default mongoose.model("Attendance", attendanceSchema);