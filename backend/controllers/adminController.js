import Device from "../models/Device.js";
import { generateWabombActivationKey } from "../utils/generateWabombActivationKey.js";
import { generateEmailStormActivationKey } from "../utils/generateEmailStormActivationKey.js";

export const add_device = async (req, res) => {
    const { macId, motherboardSerial, name, appName, validityType } = req.body;
    const { id: adminId } = req.user; // Assuming req.user is populated by authentication middleware

    try {
        if (!macId || !motherboardSerial || !appName || !validityType) {
            return res.status(400).json({ message: "All fields (Processor ID, Motherboard Serial, App Name, Validity Period) are required." });
        }

        if (appName !== "WA BOMB" && appName !== "Email Storm") {
            return res.status(400).json({ message: "Invalid app type. Must be 'WA BOMB' or 'Email Storm'." });
        }

        if (validityType !== "1_MONTH" && validityType !== "LIFETIME") {
            return res.status(400).json({ message: "Invalid validity type. Must be '1_MONTH' or 'LIFETIME'." });
        }

        const existingDevice = await Device.findOne({
            macId,
            motherboardSerial,
            appName,
        });

        if (existingDevice) {
            return res.status(400).json({ message: `Device with Processor ID '${macId}', Motherboard Serial '${motherboardSerial}', and App '${appName}' already exists.` });
        }

        let activationKey;
        if (appName === "WA BOMB") {
            activationKey = generateWabombActivationKey(macId, motherboardSerial);
        } else if (appName === "Email Storm") { // Changed from "emailStorm" to "Email Storm" for consistency with frontend
            activationKey = generateEmailStormActivationKey(macId, motherboardSerial);
        }

        if (!activationKey) {
            return res.status(500).json({ message: "Failed to generate activation key." });
        }

        let expirationDate;
        if (validityType === "1_MONTH") {
            expirationDate = new Date(); 
            expirationDate.setMonth(expirationDate.getMonth() + 1);
            expirationDate.setHours(23, 59, 59, 999); 
        } else if (validityType === "LIFETIME") {
            expirationDate = new Date('9999-12-31T23:59:59Z'); 
        }

        const deviceData = {
            macId,
            motherboardSerial,
            activationKey,
            deviceStatus: "active", 
            expirationDate,
            appName,
            adminId,
        };

        if (name && name.trim() !== "") {
            deviceData.name = name.trim();
        }

        const device = new Device(deviceData);
        await device.save();

        return res.status(201).json({ device });

    } catch (error) {
        console.error("Add device error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteDevice = async (req, res) => {
    const { id: adminId } = req.user;
    const { macId } = req.params;

    try {
        const device = await Device.findOneAndDelete({
            macId,
            adminId,
        });
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        return res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        console.error("Delete device error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getDevices = async (req, res) => {
    const { id: adminId } = req.user;
    try {
        const devices = await Device.find({ adminId });
        return res.status(200).json(devices);
    } catch (error) {
        console.error("Get devices error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
