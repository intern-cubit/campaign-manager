import Device from "../models/Device.js";

export const checkActivation = async (req, res) => {
    try {
        const { processorId, motherboardSerial, appName } = req.body;

        if (!processorId || !appName || !motherboardSerial) {
            return res.status(400).json({
                success: false,
                activationStatus: "Processor ID, app name, and motherboard serial are required",
            });
        }

        const device = await Device.findOne({ macId: processorId, appName, motherboardSerial });

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
        });

    } catch (error) {
        console.error("Error in checkActivation:", error);
        res.status(500).json({
            success: false,
            activationStatus: "Error checking activation",
            error: error.message,
        });
    }
};