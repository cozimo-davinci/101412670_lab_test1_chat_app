const mongoose = require("mongoose");
const validator = require("validator");

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return validator.isAlphanumeric(value.replace(/\s/g, ''));
                },
                message: "Group name must be alphanumeric."
            },
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "GroupMessage",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
