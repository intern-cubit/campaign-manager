import Device from "../models/Device.js";

export const checkActivation = async (req, res) => {
    try {
        const { systemId, appName } = req.body;

        if (!systemId || !appName) {
            return res.status(400).json({
                success: false,
                activationStatus: "systemId and app name are required",
            });
        }

        const device = await Device.findOne({ systemId, appName });

        if (!device) {
            return res.status(404).json({
                success: false,
                activationStatus: "Device not found",
            });
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (device.expirationDate && currentDate > device.expirationDate) {
            device.deviceStatus = "inactive";
            await device.save();

            return res.status(200).json({
                success: true,
                activationStatus: "inactive",
                message: "Device license has expired.",
            });
        }

        res.status(200).json({
            success: true,
            activationStatus: device.deviceStatus,
            deviceActivation: device.deviceActivation,
        });
    } catch (error) {
        console.error("Error in checkActivation:", error);
        res.status(500).json({
            success: false,
            activationStatus: "Error checking activation",
            deviceActivation: false,
            error: error.message,
        });
    }
};

export const activate = async (req, res) => {
    try {
        const { systemId, activationKey, appName} = req.body;

        if (!systemId || !activationKey || !appName) {
            return res.status(400).json({
                success: false,
                message: "systemId and app name are required",
            });
        }

        const device = await Device.findOne({ systemId, appName });

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        if (device.deviceStatus === "inactive") {
            return res.status(400).json({message: "Device is inactive. Please renew your license."});
        }

        if (device.activationKey !== activationKey) {
            return res.status(400).json({success: false, message: "Invalid activation key"});
        }

        device.deviceActivation = true;
        device.deviceStatus = "active";
        await device.save();

        res.status(200).json({
            success: true,
            message: "Device activated successfully",
            deviceActivation: device.deviceActivation,
        });
    } catch (error) {
        console.error("Error in activate:", error);
        res.status(500).json({
            success: false,
            message: "Error activating device",
            error: error.message,
        });
    }
};
