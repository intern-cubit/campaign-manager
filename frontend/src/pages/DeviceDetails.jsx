import { useState, useEffect } from "react";
import {
    ChevronLeft,
    Activity,
    Key,
    Clock,
    Hash,
    Wifi,
    AlertTriangle,
    Download,
    Calendar,
    Trash2,
    Crown,
    Shield,
    WifiOff,
    CheckCircle,
    User,
    Database,
    FileText,
    Copy,
    RefreshCw,
    Search, // Added for potential future use or just for a more comprehensive icon set
    BarChart2, // Added for report section icon
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function DeviceDetails() {
    const { macId } = useParams();
    const navigate = useNavigate();

    const [device, setDevice] = useState({
        _id: "",
        macId: "",
        activationKey: "",
        adminId: "",
        deviceStatus: "",
        createdAt: "",
        updatedAt: "",
        __v: 0,
        appName: "", // Added appName to the device state
        motherboardSerial: "", // Added motherboardSerial for explicit clarity
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);
    const [copySuccess, setCopySuccess] = useState("");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/device/${macId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (!data) {
                    throw new Error("Device not found");
                }
                setDevice(data);

                // Set default date to today
                const today = new Date().toISOString().split('T')[0];
                setSelectedDate(today);

                setLoading(false);
            } catch (error) {
                setError("Failed to fetch device details. Please try refreshing.");
                setLoading(false);
            }
        };

        fetchDeviceDetails();
    }, [macId, BACKEND_URL]); // Added BACKEND_URL to dependency array

    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get relative time
    const getRelativeTime = (dateString) => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffSeconds = Math.floor(diffTime / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays === 0) {
            if (diffHours === 0) {
                if (diffMinutes === 0) {
                    return `${diffSeconds} seconds ago`;
                }
                return `${diffMinutes} minutes ago`;
            }
            return `${diffHours} hours ago`;
        }
        if (diffDays === 1) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
        return `${Math.ceil(diffDays / 365)} years ago`;
    };

    // Get status configuration
    const getStatusConfig = (status) => {
        return status === 'active'
            ? {
                color: 'text-green-400',
                bg: 'bg-green-500/20',
                border: 'border-green-500/30',
                icon: <Wifi size={18} className="text-green-400" />,
                label: 'active',
                pulse: 'animate-pulse'
            }
            : {
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/20',
                border: 'border-yellow-500/30',
                icon: <WifiOff size={18} className="text-yellow-400" />,
                label: 'Inactive',
                pulse: ''
            };
    };

    // Copy to clipboard function
    const copyToClipboard = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(label);
            setTimeout(() => setCopySuccess(""), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Optionally, show a more generic error message to the user
        }
    };

    // Handle navigation back to dashboard
    const handleBackToDashboard = () => {
        navigate(-1);
    };

    // Handle date change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Handle report download
    const handleReportDownload = async () => {
        if (!selectedDate) {
            setDownloadError("Please select a date for the report.");
            return;
        }

        setIsDownloading(true);
        setDownloadError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/device/download-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    macId: device.macId,
                    adminId: device.adminId, // Assuming adminId is needed for report generation
                    date: selectedDate,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate report");
            }

            const { downloadUrl } = await response.json();
            await handleDownload(downloadUrl, device.macId, selectedDate);

        } catch (error) {
            setDownloadError(error.message);
            console.error("Download error:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownload = async (url, macId, date) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Could not fetch the report file');

            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
            const fileName = `report_${macId}_${formattedDate}.zip`; // Changed to .zip as per common practice for multiple files

            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
            setCopySuccess("Report downloaded successfully!"); // Reusing copySuccess for general alerts
            setTimeout(() => setCopySuccess(""), 3000);
        } catch (err) {
            console.error(err);
            setDownloadError(`Download error: ${err.message}`);
        }
    };

    // Handle delete device
    const handleDeleteDevice = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/delete-device/${macId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete device");
            }

            setIsDeleteModalOpen(false);
            setIsDeleted(true);

            setTimeout(() => {
                handleBackToDashboard();
            }, 1500);

        } catch (error) {
            setDeleteError(`Error deleting device: ${error.message}. Please try again.`);
            setIsDeleting(false);
        }
    };

    const statusConfig = getStatusConfig(device.deviceStatus);

    if (isDeleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] flex items-center justify-center p-4">
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-green-500/50 rounded-2xl p-8 text-center max-w-md shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-400 mb-3">Device Deleted Successfully!</h2>
                    <p className="text-gray-300 mb-6">The device has been permanently removed from the system.</p>
                    <button
                        onClick={handleBackToDashboard}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 text-lg font-semibold"
                    >
                        Return to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c0f13] via-black to-[#13171b] text-white font-sans">
            <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-10 max-w-7xl">
                {/* Back Button */}
                <motion.button
                    onClick={handleBackToDashboard}
                    className="flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors group text-lg font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ x: -5 }}
                >
                    <ChevronLeft size={22} className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </motion.button>

                {/* Main Content Card */}
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 p-6 lg:p-8 border-b border-gray-700/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-5">
                            <div className="w-18 h-18 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg p-3">
                                <Wifi size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                                    Device Details
                                </h1>
                                <p className="text-gray-300 text-lg mt-2 flex items-center">
                                    <Hash size={18} className="mr-2 text-gray-500" />
                                    Processor ID: <span className="font-mono ml-2 text-purple-300">{device.macId}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className={`${statusConfig.bg} ${statusConfig.border} border rounded-full px-5 py-2 flex items-center space-x-2 shadow-inner`}>
                                <div className={`w-3 h-3 rounded-full ${statusConfig.color.replace('text-', 'bg-')} ${statusConfig.pulse}`}></div>
                                <span className={`text-base font-semibold ${statusConfig.color}`}>
                                    {statusConfig.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 lg:p-8">
                        {loading ? (
                            <div className="text-center py-20">
                                <motion.div
                                    className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                />
                                <p className="text-xl text-gray-300 font-medium">Loading device details...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-red-800/20 border border-red-700/30 rounded-xl">
                                <AlertTriangle size={60} className="text-red-400 mx-auto mb-5" />
                                <h3 className="text-2xl font-bold text-red-400 mb-3">Error Loading Device</h3>
                                <p className="text-gray-300 mb-8 max-w-lg mx-auto">{error}</p>
                                <button
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-7 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 text-lg font-semibold"
                                    onClick={() => window.location.reload()}
                                >
                                    <RefreshCw size={20} className="mr-2 inline" />
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                {/* Left Column: Basic & Status */}
                                <div className="xl:col-span-2 space-y-8">
                                    {/* Basic Information */}
                                    <motion.div
                                        className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-2xl p-7 shadow-lg"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        <div className="flex items-center mb-6 border-b border-gray-600/30 pb-4">
                                            <Database size={28} className="text-purple-400 mr-4" />
                                            <h3 className="text-2xl font-bold text-purple-400">Essential Information</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Processor ID */}
                                            <InfoCard
                                                label="Processor ID"
                                                value={device.macId}
                                                icon={<Wifi size={20} className="text-purple-400" />}
                                                onCopy={() => copyToClipboard(device.macId, "Processor ID")}
                                                copySuccess={copySuccess === "Processor ID"}
                                            />

                                            {/* Activation Key */}
                                            <InfoCard
                                                label="Activation Key"
                                                value={device.activationKey}
                                                icon={<Key size={20} className="text-purple-400" />}
                                                onCopy={() => copyToClipboard(device.activationKey, "Activation Key")}
                                                copySuccess={copySuccess === "Activation Key"}
                                            />

                                            {/* App Name */}
                                            {device.appName && (
                                                <InfoCard
                                                    label="Application Name"
                                                    value={device.appName}
                                                    icon={<FileText size={20} className="text-purple-400" />}
                                                    onCopy={() => copyToClipboard(device.appName, "Application Name")}
                                                    copySuccess={copySuccess === "Application Name"}
                                                />
                                            )}

                                            {/* Motherboard Serial */}
                                            <InfoCard
                                                label="Motherboard Serial"
                                                value={device.motherboardSerial || device._id}
                                                icon={<Hash size={20} className="text-purple-400" />}
                                                onCopy={() => copyToClipboard(device.motherboardSerial || device._id, "Motherboard Serial")}
                                                copySuccess={copySuccess === "Motherboard Serial"}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Status Overview */}
                                    <motion.div
                                        className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-2xl p-7 shadow-lg"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    >
                                        <div className="flex items-center mb-6 border-b border-gray-600/30 pb-4">
                                            <Activity size={28} className="text-green-400 mr-4" />
                                            <h3 className="text-2xl font-bold text-green-400">Status Overview</h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className={`${statusConfig.bg} ${statusConfig.border} border rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-inner`}>
                                                <div className="flex items-center mb-2">
                                                    {statusConfig.icon}
                                                    <span className="ml-2 text-sm font-medium text-gray-400">Current Status</span>
                                                </div>
                                                <p className={`text-xl font-bold ${statusConfig.color} capitalize`}>
                                                    {device.deviceStatus}
                                                </p>
                                            </div>
                                            {/* Could add more status metrics here if available, e.g., last seen, uptime etc. */}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right Column: Administrative, Timestamps, Report Download */}
                                <div className="xl:col-span-1 space-y-8">
                                    {/* Administrative */}
                                    <motion.div
                                        className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-2xl p-7 shadow-lg"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                    >
                                        <div className="flex items-center mb-6 border-b border-gray-600/30 pb-4">
                                            <User size={28} className="text-yellow-400 mr-4" />
                                            <h3 className="text-2xl font-bold text-yellow-400">Administrative</h3>
                                        </div>

                                        <InfoCard
                                            label="Admin ID"
                                            value={device.adminId}
                                            icon={<Shield size={20} className="text-yellow-400" />}
                                            onCopy={() => copyToClipboard(device.adminId, "Admin ID")}
                                            copySuccess={copySuccess === "Admin ID"}
                                        />
                                    </motion.div>

                                    {/* Timestamps */}
                                    <motion.div
                                        className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-2xl p-7 shadow-lg"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                    >
                                        <div className="flex items-center mb-6 border-b border-gray-600/30 pb-4">
                                            <Clock size={28} className="text-blue-400 mr-4" />
                                            <h3 className="text-2xl font-bold text-blue-400">Timeline</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <TimeCard
                                                label="Registered On"
                                                date={device.createdAt}
                                                icon={<Calendar size={20} className="text-blue-400" />}
                                                formatDate={formatDate}
                                                getRelativeTime={getRelativeTime}
                                            />
                                            <TimeCard
                                                label="Last Updated"
                                                date={device.updatedAt}
                                                icon={<RefreshCw size={20} className="text-blue-400" />}
                                                formatDate={formatDate}
                                                getRelativeTime={getRelativeTime}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-700/50 p-6 lg:p-8 flex flex-col sm:flex-row justify-end gap-4 bg-gray-800/60">
                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-7 py-3 rounded-lg transition-all duration-300 flex items-center justify-center font-semibold text-lg hover:shadow-lg hover:shadow-green-500/20">
                            <Crown size={20} className="mr-2" />
                            Upgrade Plan
                        </button>
                        <button
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-7 py-3 rounded-lg transition-all duration-300 flex items-center justify-center font-semibold text-lg hover:shadow-lg hover:shadow-red-500/20"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 size={20} className="mr-2" />
                            Delete Device
                        </button>
                    </div>
                </motion.div>

                {/* Copy Success Notification */}
                <AnimatePresence>
                    {copySuccess && (
                        <motion.div
                            className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 text-base font-medium"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center">
                                <CheckCircle size={20} className="mr-3" />
                                <span>'{copySuccess}' copied to clipboard!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {isDeleteModalOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md border border-red-500/50 rounded-2xl shadow-2xl shadow-red-900/30 p-8 w-full max-w-lg text-center"
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertTriangle size={32} className="text-red-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-red-400 mb-3">Confirm Deletion</h3>
                                <p className="text-gray-300 text-lg mb-6">
                                    Are you absolutely sure you want to delete this device?
                                    <br />
                                    <span className="font-semibold text-red-300">This action cannot be undone.</span>
                                </p>

                                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 mb-6">
                                    <p className="text-sm text-gray-400 mb-1">Device Processor ID:</p>
                                    <p className="font-mono text-yellow-400 break-all text-lg font-semibold">{device.macId}</p>
                                </div>

                                {deleteError && (
                                    <motion.div
                                        className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-base flex items-center"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <AlertTriangle size={18} className="inline mr-3" />
                                        {deleteError}
                                    </motion.div>
                                )}

                                <div className="flex justify-center gap-4 mt-6">
                                    <button
                                        className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 text-white px-7 py-3 rounded-lg transition-all duration-300 font-semibold text-lg"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-7 py-3 rounded-lg transition-all duration-300 flex items-center justify-center font-semibold text-lg hover:shadow-lg hover:shadow-red-500/20"
                                        onClick={handleDeleteDevice}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={20} className="mr-3" />
                                                Delete Permanently
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Reusable component for displaying info cards
const InfoCard = ({ label, value, icon, onCopy, copySuccess }) => (
    <div className="bg-gray-700/40 rounded-xl p-5 border border-gray-600/40 hover:border-purple-500/50 transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
                {icon}
                <span className="ml-3 text-base font-medium text-gray-400">{label}</span>
            </div>
            <motion.button
                onClick={onCopy}
                className="text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-600/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Copy size={18} />
            </motion.button>
        </div>
        <p className="text-white font-mono text-md break-all">{value || "N/A"}</p>
    </div>
);

// Reusable component for displaying time cards
const TimeCard = ({ label, date, icon, formatDate, getRelativeTime }) => (
    <div className="bg-gray-700/40 rounded-xl p-5 border border-gray-600/40 hover:border-blue-500/50 transition-colors duration-200">
        <div className="flex items-center mb-3">
            {icon}
            <span className="ml-3 text-base font-medium text-gray-400">{label}</span>
        </div>
        <p className="text-white text-md">{formatDate(date)}</p>
        <p className="text-gray-400 text-sm mt-1">{getRelativeTime(date)}</p>
    </div>
);