const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        default: 'Any',
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    approvals: {
        type: [mongoose.Types.ObjectId]
    },
    status: {
        type: Number,
        default: 0
    }
});

module.exports = Task = mongoose.model('Task', TaskSchema);