const { Schema, model, Types } = require("mongoose");

const carSchema = new Schema(
    {

        model: {
            type: String,
            required: [true, 'Model is required']
        },

        make: {
            type: String,
            required: [true, 'Make is required']
        },
        year: {
            type: String
        },
        seats: {
            type: Number,
            required: [true, 'You have to specify number of sits'],
            min: [1, 'One seat is minimum available']
        },
        color: {
            type: String,
            required: [true, 'Color is required']

        },

        energeticClassification: {
            type: String,
            enum: ['B', 'C', 'ECO', '0'],
            required: [true, 'You have to specify your energetic clasification']
        }

    },

    {
        timestamps: true,
    }
);

const Car = model("Car", carSchema);

module.exports = Car;



