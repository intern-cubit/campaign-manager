import Device from "../models/Device.js";
import { generateWabombActivationKey } from "../utils/generateWabombActivationKey.js";
import { generateEmailStormActivationKey } from "../utils/generateEmailStormActivationKey.js";

export const add_device = async (req, res) => {
    const { macId, motherboardSerial, name, appName, validityType, customValidityDate } = req.body;
    const { id: adminId } = req.user; 

    try {
        if (!macId || !motherboardSerial || !appName || !validityType) {
            return res.status(400).json({ message: "All required fields are missing." });
        }

        if (appName !== "WA BOMB" && appName !== "Email Storm") {
            return res.status(400).json({ message: "Invalid app type. Must be 'WA BOMB' or 'Email Storm'." });
        }

        if (validityType !== "CUSTOM_DATE" && validityType !== "LIFETIME") {
            return res.status(400).json({ message: "Invalid validity type. Must be 'CUSTOM_DATE' or 'LIFETIME'." });
        }

        let expirationDate;
        if (validityType === "CUSTOM_DATE") {
            if (!customValidityDate) {
                return res.status(400).json({ message: "Custom validity date is required for 'CUSTOM_DATE' type." });
            }
            const parsedDate = new Date(customValidityDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: "Invalid custom validity date format." });
            }

            parsedDate.setHours(23, 59, 59, 999); 
            if (parsedDate < new Date()) {
                return res.status(400).json({ message: "Custom validity date cannot be in the past." });
            }
            expirationDate = parsedDate;

        } else if (validityType === "LIFETIME") {
            expirationDate = new Date('9999-12-31T23:59:59Z'); // Effectively "lifetime"
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
        } else if (appName === "Email Storm") {
            activationKey = generateEmailStormActivationKey(macId, motherboardSerial);
        }

        if (!activationKey) {
            return res.status(500).json({ message: "Failed to generate activation key." });
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
