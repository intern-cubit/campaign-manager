import { useState } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { addDeviceSuccess } from "../features/deviceSlice";

const AddDeviceModal = ({ isOpen, onClose }) => {
    const [macId, setMacId] = useState("");
    const [motherboardSerial, setMotherboardSerial] = useState("");
    const [name, setName] = useState("");
    const [appName, setAppName] = useState("");
    const [validityType, setValidityType] = useState("");
    
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        if (!appName) {
            setMessage("❌ Please select an app type.");
            setIsLoading(false);
            return;
        }

        if (!validityType) {
            setMessage("❌ Please select a validity period.");
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                macId,
                motherboardSerial,
                appName,
                validityType,
            };

            if (name.trim() !== "") {
                payload.name = name.trim();
            }

            const response = await fetch(`${BACKEND_URL}/api/admin/add-device`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to add device.");
            }
            setMessage("🎉 Device added successfully!");
            dispatch(addDeviceSuccess(data.device));
            setTimeout(() => {
                onClose();
                setMacId("");
                setMotherboardSerial("");
                setName("");
                setAppName("");
                setValidityType("");
                setMessage("");
            }, 2000);

        } catch (err) {
            setMessage(`❌ ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#111827] via-black to-[#10151b] bg-[rgba(30,30,30,0.5)] backdrop-blur-md border border-gray-800 rounded-xl p-6 w-full max-w-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Add New Device</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg mb-4 ${message.includes('❌')
                        ? 'bg-red-900/20 border border-red-800 text-red-300'
                        : 'bg-green-900/20 border border-green-800 text-green-300'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Processor ID and Motherboard Serial - Side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Processor ID
                            </label>
                            <input
                                type="text"
                                value={macId}
                                onChange={(e) => setMacId(e.target.value)}
                                placeholder="e.g., PROC123456789"
                                required
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Motherboard Serial
                            </label>
                            <input
                                type="text"
                                value={motherboardSerial}
                                onChange={(e) => setMotherboardSerial(e.target.value)}
                                placeholder="e.g., MB987654321"
                                required
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Name (Optional) - Full width */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Avinash's PC"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* App Name and Validity Period - Side by side */}
                    <div className="grid gap-4">
                        {/* App Name Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                App Name
                            </label>
                            <div className="flex bg-gray-900/50 border border-gray-700 rounded-lg p-1">
                                <label
                                    className={`flex-1 text-center py-2 cursor-pointer rounded-md transition-colors duration-200 ${
                                        appName === "WA BOMB"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                                            : "text-gray-300 hover:bg-gray-700/50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="appName"
                                        value="WA BOMB"
                                        checked={appName === "WA BOMB"}
                                        onChange={() => setAppName("WA BOMB")}
                                        className="hidden"
                                    />
                                    WA BOMB
                                </label>
                                <label
                                    className={`flex-1 text-center py-2 cursor-pointer rounded-md transition-colors duration-200 ${
                                        appName === "Email Storm"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                                            : "text-gray-300 hover:bg-gray-700/50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="appName"
                                        value="Email Storm"
                                        checked={appName === "Email Storm"}
                                        onChange={() => setAppName("Email Storm")}
                                        className="hidden"
                                    />
                                    Email Storm
                                </label>
                            </div>
                        </div>

                        {/* Validity Period Selection - Adjusted gap and padding */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Validity Period
                            </label>
                            <div className="grid grid-cols-2 gap-2 bg-gray-900/50 border border-gray-700 rounded-lg p-1"> {/* Increased gap-1 to gap-2 */}
                                <label
                                    className={`text-center py-2.5 cursor-pointer rounded-md transition-colors duration-200 ${ /* Increased py-2 to py-2.5 */
                                        validityType === "1_MONTH"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                                            : "text-gray-300 hover:bg-gray-700/50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="validity"
                                        value="1_MONTH"
                                        checked={validityType === "1_MONTH"}
                                        onChange={() => {
                                            setValidityType("1_MONTH");
                                        }}
                                        className="hidden"
                                    />
                                    1 Month
                                </label>
                                <label
                                    className={`text-center py-2.5 cursor-pointer rounded-md transition-colors duration-200 ${ /* Increased py-2 to py-2.5 */
                                        validityType === "LIFETIME"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                                            : "text-gray-300 hover:bg-gray-700/50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="validity"
                                        value="LIFETIME"
                                        checked={validityType === "LIFETIME"}
                                        onChange={() => {
                                            setValidityType("LIFETIME");
                                        }}
                                        className="hidden"
                                    />
                                    Lifetime
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Adding..." : "Add Device"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddDeviceModal;