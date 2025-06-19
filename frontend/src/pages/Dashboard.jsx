import React, { useState, useEffect, Suspense, lazy, memo } from 'react';
import {
    User,
    Settings,
    Smartphone,
    AlertTriangle,
    CheckCircle,
    AlertCircle,
    DollarSign,
    ChevronRight,
    PlusCircle,
    Activity,
    Calendar,
    MapPin,
    Bell,
    Search,
    Filter,
    Grid,
    List,
    Wifi,
    WifiOff,
    Clock,
    MoreVertical,
    DownloadCloud // Import DownloadCloud icon for the new button
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Re-import useSelector as requested, note: may require proper Redux setup in your environment
import { motion, AnimatePresence, animate } from 'framer-motion';
import AddDeviceModal from '../components/AddDeviceModal';

// Enhanced Stats Card Component
const StatsCard = ({ title, value, icon, trend, color = "purple", subtitle }) => {
    const colorClasses = {
        purple: "from-purple-600/20 to-blue-600/20 border-purple-500/30 hover:shadow-purple-500/20",
        green: "from-green-600/20 to-emerald-600/20 border-green-500/30 hover:shadow-green-500/20",
        yellow: "from-yellow-600/20 to-orange-600/20 border-yellow-500/30 hover:shadow-yellow-500/20",
        blue: "from-blue-600/20 to-cyan-600/20 border-blue-500/30 hover:shadow-blue-500/20"
    };

    return (
        <motion.div
            className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-2xl p-5 lg:p-7 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group flex flex-col justify-between`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm lg:text-base text-gray-300 font-medium mb-1">{title}</p>
                    {typeof value === 'number' ? (
                        <span className="text-2xl lg:text-3xl font-bold text-white">{value}</span>
                    ) : (
                        <span className="text-2xl lg:text-3xl font-bold text-white">{value}</span>
                    )}
                </div>
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 shadow-inner">
                    {icon}
                </div>
            </div>
            {(trend || subtitle) && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                    {trend && (
                        <div className="flex items-center text-xs">
                            <span className="text-green-400 flex items-center">
                                ↗ {trend}
                            </span>
                        </div>
                    )}
                    {subtitle && (
                        <span className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </motion.div>
    );
};

// Enhanced Device Card Component
const DeviceCard = memo(({ device, index, viewMode }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays <= 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusConfig = (status) => {
        return status === 'active'
            ? { color: 'text-green-400', bg: 'bg-green-500/20', icon: <Wifi size={16} />, label: 'Active' }
            : { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <WifiOff size={16} />, label: 'Inactive' };
    };

    const statusConfig = getStatusConfig(device.deviceStatus);

    return (
        <motion.div
            className={`bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-5 lg:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/15 hover:border-purple-500/40 cursor-pointer group flex ${viewMode === 'list' ? 'items-center justify-between' : 'flex-col'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: viewMode === 'list' ? 0 : -2, scale: viewMode === 'list' ? 1.01 : 1.02 }}
            onClick={() => navigate(`/device/${device.macId}`)}
        >
            {/* Header / Main Info */}
            <div className={`flex items-start ${viewMode === 'list' ? 'flex-grow' : 'justify-between'} mb-4 ${viewMode === 'list' ? 'mb-0 mr-4' : ''}`}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                        <Smartphone size={18} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-mono text-base lg:text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {device.name || device.macId}
                        </h3>
                        <p className="text-xs text-gray-400">{device.name ? device.macId : "Device ID"}</p>
                    </div>
                </div>
                {viewMode === 'grid' && (
                    <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                            <MoreVertical size={14} className="text-gray-400" />
                        </button>
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                )}
            </div>

            {/* Status Indicators (adjust for list view) */}
            <div className={`grid gap-3 ${viewMode === 'list' ? 'grid-cols-2 w-1/3 min-w-[200px] mr-4' : 'grid-cols-2 mb-4'}`}>
                <div className={`${statusConfig.bg} rounded-lg p-3 flex items-center space-x-2 border border-gray-700/50`}>
                    <div className={statusConfig.color}>
                        {statusConfig.icon}
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Status</p>
                        <p className={`text-sm font-medium ${statusConfig.color}`}> {/* Ensure proper class concatenation */}
                            {statusConfig.label}
                        </p>
                    </div>
                </div>
                {/* Placeholder for another stat if needed, otherwise remove the grid */}
                <div className="bg-gray-700/30 rounded-lg p-3 flex items-center space-x-2 border border-gray-700/50">
                    <div className="text-blue-400">
                        <Activity size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Activity</p>
                        <p className="text-sm font-medium text-blue-400">Normal</p> {/* Example static data */}
                    </div>
                </div>
            </div>

            {/* App Name & Footer */}
            <div className={`flex flex-col ${viewMode === 'list' ? 'items-end' : ''}`}>
                <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-1">Application</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${device.appName === 'WA BOMB' ? 'bg-green-600/30 text-green-300' :
                        device.appName === 'Email Storm' ? 'bg-blue-600/30 text-blue-300' :
                            'bg-gray-600/30 text-gray-300'
                        } border border-gray-700/50`}>
                        {device.appName || 'N/A'}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-700/50 w-full">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock size={12} />
                        <span>Created {formatDate(device.createdAt)}</span>
                    </div>
                    {viewMode === 'list' && (
                        <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                                <MoreVertical size={14} className="text-gray-400" />
                            </button>
                            <ChevronRight size={18} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

// Loading Skeleton Component
const DeviceCardSkeleton = ({ viewMode }) => (
    <div className={`bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-5 lg:p-6 animate-pulse flex ${viewMode === 'list' ? 'items-center justify-between' : 'flex-col'}`}>
        <div className={`flex items-start ${viewMode === 'list' ? 'flex-grow' : 'justify-between'} mb-4 ${viewMode === 'list' ? 'mb-0 mr-4' : ''}`}>
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-xl"></div>
                <div>
                    <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="w-16 h-3 bg-gray-800 rounded"></div>
                </div>
            </div>
            {viewMode === 'grid' && (
                <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
            )}
        </div>
        <div className={`grid gap-3 ${viewMode === 'list' ? 'grid-cols-2 w-1/3 min-w-[200px] mr-4' : 'grid-cols-2 mb-4'}`}>
            <div className="bg-gray-700/30 rounded-lg p-3 h-16"></div>
            <div className="bg-gray-700/30 rounded-lg p-3 h-16"></div>
        </div>
        <div className={`flex flex-col ${viewMode === 'list' ? 'items-end' : ''}`}>
            <div className="mb-4">
                <div className="w-20 h-4 bg-gray-700 rounded mb-2"></div>
                <div className="w-32 h-6 bg-gray-700 rounded"></div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-700/50 w-full">
                <div className="w-20 h-3 bg-gray-700 rounded"></div>
                {viewMode === 'list' && (
                    <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                )}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    // Hardcoded BACKEND_URL to resolve 'import.meta.env' warning in this environment
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const storedUser = localStorage.getItem('user');
    // Using useSelector as requested. If Redux is not set up in your broader application,
    // this line might cause issues. Ensure your app is wrapped in a <Provider> from 'react-redux'.
    const reduxUser = useSelector((s) => s.auth.user);
    const [user] = useState(storedUser ? JSON.parse(storedUser) : reduxUser);
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterAppName, setFilterAppName] = useState('all'); // New state for app name filter
    const [viewMode, setViewMode] = useState('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/admin/get-devices`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) throw new Error('Fetch failed');
                const data = await res.json();
                setDevices(data || []);
                setFilteredDevices(data || []);
            } catch (e) { // Catch the error object for better debugging
                console.error("Failed to fetch devices:", e);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        })();
    }, [BACKEND_URL]);

    // Filter devices based on search, status, and app name
    useEffect(() => {
        let filtered = devices;

        if (searchTerm) {
            filtered = filtered.filter(device =>
                device.macId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (device.name && device.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(device =>
                device.deviceStatus === filterStatus
            );
        }

        if (filterAppName !== 'all') {
            filtered = filtered.filter(device =>
                device.appName === filterAppName
            );
        }

        setFilteredDevices(filtered);
    }, [devices, searchTerm, filterStatus, filterAppName]);

    const activeCount = devices.filter((d) => d.deviceStatus === 'active').length;
    const totalDevices = devices.length;
    const lastUpdate = devices[0]?.updatedAt; // Assuming latest updated device's timestamp

    // Format lastUpdate to a more readable date
    const formattedLastUpdate = lastUpdate
        ? new Date(lastUpdate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric' // Added year for clarity
        })
        : 'N/A';


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0c0f16] via-[#1a1f2c] to-[#0c0f16] flex items-center justify-center p-4">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-300">Loading dashboard data...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0c0f16] via-[#1a1f2c] to-[#0c0f16] flex items-center justify-center p-4">
                <motion.div
                    className="text-center p-8 bg-[rgba(30,30,30,0.5)] backdrop-blur-md border border-red-500/50 rounded-xl max-w-md shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-md"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c0f16] via-[#1a1f2c] to-[#0c0f16] text-white font-sans">
            <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-10 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-3xl p-6 lg:p-10 mb-10 shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-5 flex-1">
                            <div className="w-18 h-18 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                <User size={window.innerWidth < 768 ? 32 : 40} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                                    Welcome back, {user?.fullName || 'User'}!
                                </h1>
                                <p className="text-base lg:text-lg text-gray-300 mt-2 truncate">{user?.email || 'Email not available'}</p>
                                <p className="text-sm text-gray-400 mt-1">@{user?.username || 'username'}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full lg:w-auto justify-end">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-7 py-3 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 text-base font-semibold"
                            >
                                <PlusCircle size={20} className="mr-2" />
                                Add Device
                            </button>
                            {/* New Download Apps button */}
                            <button
                                onClick={() => navigate('/download-apps')} // Navigate to the download page
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-7 py-3 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-base font-semibold"
                            >
                                <DownloadCloud size={20} className="mr-2" />
                                Download Apps
                            </button>
                        </div>
                    </div>

                    {/* App Links Section */}
                    <div className="mt-8 pt-6 border-t border-gray-700/50 flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <span className="text-gray-300 font-semibold text-lg">WA BOMB:</span>
                            <div className="flex flex-wrap gap-3">
                                <a href="https://www.cubitdynamics.com/about-wa-bomb" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">About</a>
                                <a href="https://www.cubitdynamics.com/privacy-policy-wa-bomb" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a>
                                <a href="https://www.cubitdynamics.com/contact-us-wa-bomb" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Contact Us</a>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
                            <span className="text-gray-300 font-semibold text-lg">Mail Storm:</span>
                            <div className="flex flex-wrap gap-3">
                                <a href="https://www.cubitdynamics.com/about-mailstorm" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">About</a>
                                <a href="https://www.cubitdynamics.com/privacy-policy-mailstorm" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
                                <a href="https://www.cubitdynamics.com/contact-us-mailstorm" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Contact Us</a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-10">
                    <StatsCard
                        title="Total Devices"
                        value={totalDevices}
                        icon={<Smartphone size={28} className="text-purple-400" />}
                        color="purple"
                        trend="+12% this month"
                        subtitle="All registered"
                    />
                    <StatsCard
                        title="Active Devices"
                        value={activeCount}
                        icon={<Activity size={28} className="text-green-400" />}
                        color="green"
                        trend="+8% this week"
                        subtitle="Currently Active"
                    />
                    <StatsCard
                        title="Last Updated"
                        value={formattedLastUpdate}
                        icon={<Calendar size={28} className="text-blue-400" />}
                        color="blue"
                        subtitle="Recent activity"
                    />
                    <StatsCard
                        title="Inactive Devices"
                        value={totalDevices - activeCount}
                        icon={<WifiOff size={28} className="text-yellow-400" />}
                        color="yellow"
                        subtitle="Awaiting connection"
                    />
                </div>

                {/* Devices Section */}
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Section Header */}
                    <div className="p-6 lg:p-8 border-b border-gray-700/50">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
                                    <MapPin size={26} className="mr-3 text-purple-400" />
                                    Device Management
                                </h2>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span className="flex items-center">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                                        Active: {activeCount}
                                    </span>
                                    <span className="flex items-center">
                                        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-2"></div>
                                        Inactive: {totalDevices - activeCount}
                                    </span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                {/* Search */}
                                <div className="relative flex-1 lg:w-64">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search devices..."
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Status Filter */}
                                <select
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all appearance-none pr-8 cursor-pointer"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                {/* App Name Filter */}
                                <select
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all appearance-none pr-8 cursor-pointer"
                                    value={filterAppName}
                                    onChange={(e) => setFilterAppName(e.target.value)}
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="all">All Apps</option>
                                    <option value="WA BOMB">WA BOMB</option>
                                    <option value="Email Storm">Mail Storm</option>
                                </select>

                                {/* View Toggle */}
                                <div className="flex bg-gray-700/50 border border-gray-600/50 rounded-xl p-1">
                                    <button
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700/70'}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700/70'}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Device Grid/List */}
                    <div className="p-6 lg:p-8">
                        {loading ? (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {[...Array(6)].map((_, i) => (
                                    <DeviceCardSkeleton key={i} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : filteredDevices.length > 0 ? (
                            <AnimatePresence mode="wait">
                                <motion.div // Fixed casing: motion.Div to motion.div
                                    key={viewMode}
                                    className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {filteredDevices.map((device, index) => (
                                        <DeviceCard key={device.macId} device={device} index={index} viewMode={viewMode} />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="text-center py-20">
                                <Smartphone size={80} className="text-gray-700 mx-auto mb-8 animate-pulse" />
                                <h3 className="text-2xl text-gray-300 font-semibold mb-3">
                                    {searchTerm || filterStatus !== 'all' || filterAppName !== 'all' ? 'No devices match your criteria' : 'No devices found'}
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    {searchTerm || filterStatus !== 'all' || filterAppName === 'all'
                                        ? 'Try adjusting your search query or filter settings to find devices.'
                                        : 'It looks like you haven\'t added any tracking devices yet. Click the button below to get started!'
                                    }
                                </p>
                                {!searchTerm && filterStatus === 'all' && filterAppName === 'all' && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 text-lg font-medium"
                                    >
                                        <PlusCircle size={22} className="mr-3" />
                                        Add Your First Device
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            <AddDeviceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;