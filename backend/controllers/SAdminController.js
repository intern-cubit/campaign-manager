import Device from "../models/Device.js";

export const checkActivation = async (req, res) => {
    try {
        const { processorId, activationKey, motherboardSerial } = req.body;

        if (!processorId || !activationKey || !motherboardSerial) {
            return res.status(400).json({
                success: false,
                activationStatus: "Processor ID, activation key, and motherboard serial are required",
            });
        }

        const device = await Device.findOne({macId: processorId, activationKey, motherboardSerial});

        if (!device) {
            return res.status(404).json({
                success: false,
                activationStatus: "Device not found",
            });
        }

        res.status(200).json({
            success: true,
            activationStatus: device.deviceStatus,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            activationStatus: "Error checking activation",
            error: error.message,
        });
    }
}