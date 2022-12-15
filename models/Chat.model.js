const { Schema, model, Types } = require("mongoose");

const chatSchema = new Schema(
    {
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        messages: [{
            author: {
                type: Types.ObjectId,
                ref: 'User'
            },
            text: { type: String },
            time: { type: String }
        }],
        trip: {
            type: Types.ObjectId,
            ref: "Trip"
        }
    },
    {
        timestamps: true,
    }
);

const Chat = model("Chat", chatSchema);

module.exports = Chat;
