import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
    {
        systemId: {
            type: String,
            required: true,
        },
        activationKey: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        deviceStatus: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
        deviceActivation: {
            type: Boolean,
            default: false,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        appName:{
            type: String,
            required: true,
            enum: ["WA BOMB", "Email Storm", "Cubi-View"],
        }
    },
    { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);