const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: mongoose.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    submission: {
        type: String,
        required: true,
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
        default: 0,
    }
});

module.exports = Submission = mongoose.model('Submission', SubmissionSchema);