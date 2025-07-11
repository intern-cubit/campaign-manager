import Device from "../models/Device.js";
import { generateWabombActivationKey } from "../utils/generateWabombActivationKey.js";
import { generateEmailStormActivationKey } from "../utils/generateEmailStormActivationKey.js";
import { generateCubiViewActivationKey } from "../utils/generateCubiViewActivationKey.js"; 

export const add_device = async (req, res) => {
    const { systemId, name, appName, validityType, customValidityDate } = req.body;
    const { id: adminId } = req.user;

    try {
        if (!systemId || !appName || !validityType) {
            return res.status(400).json({ message: "All required fields are missing." });
        }

        if (appName !== "WA BOMB" && appName !== "Email Storm" && appName !== "Cubi-View") {
            return res.status(400).json({ message: "Invalid app type. Must be 'WA BOMB', 'Email Storm' or 'Cubi-view'." });
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
            expirationDate = new Date('9999-12-31T23:59:59Z');
        }

        const existingDevice = await Device.findOne({
            systemId,
            appName,
        });

        if (existingDevice) {
            return res.status(400).json({ message: `Device with System ID ${systemId}', and App '${appName}' already exists.` });
        }

        let activationKey;
        if (appName === "WA BOMB") {
            activationKey = generateWabombActivationKey(systemId);
        } else if (appName === "Email Storm") {
            activationKey = generateEmailStormActivationKey(systemId);
        } else if (appName === "Cubi-View") {
            activationKey = generateCubiViewActivationKey(systemId); // Assuming same key generation for Cubi-View
        }
        console.log("Generated Activation Key:", activationKey);

        if (!activationKey) {
            return res.status(500).json({ message: "Failed to generate activation key." });
        }

        const deviceData = {
            systemId,
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

        if (error.code === 11000 && error.keyPattern && error.keyPattern.systemId) {
            return res.status(400).json({
                message: `A device with System ID '${error.keyValue.systemId}' already exists. System ID must be unique.`,
                errorCode: 'DUPLICATE_MAC_ID'
            });
        } else if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteDevice = async (req, res) => {
    const { id: adminId } = req.user;
    const { systemId, appName } = req.body;

    try {
        const device = await Device.findOneAndDelete({
            systemId,
            appName,
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
