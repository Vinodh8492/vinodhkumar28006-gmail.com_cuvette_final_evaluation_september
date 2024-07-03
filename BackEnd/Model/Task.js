const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    Assign_to: {
        type: String
    },
    userEmail: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: ['high priority', 'low priority', 'moderate priority']
    },
    checklist: {
        type: [{
            item: {
                type: String,
                required: true
            },
            checked: {
                type: Boolean,
                default: false
            }
        }],
        validate: {
            validator: function (array) {
                return array.length > 0;
            },
            message: 'Checklist must have at least one item.'
        }
    },
    date: {
        type: String,

    },
    status: {
        type: String,
        required: true,
        enum: ['backlog', 'to do', 'in progress', 'done'],
        default: 'to do'
    },

}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

