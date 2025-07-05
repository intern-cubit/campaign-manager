import React from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud, Smartphone, Mail, Info, ChevronLeft } from 'lucide-react'; // Added Info icon for app details
import { useNavigate } from 'react-router-dom';

const DownloadCenter = () => {
    const WA_BOMB_DOWNLOAD_URL = "https://github.com/intern-cubit/wa-bomb/releases/download/v0.0.9/WA-BOMB-Setup-0.0.5.exe";
    const EMAIL_STORM_DOWNLOAD_URL = "https://github.com/intern-cubit/mailstorm/releases/download/v0.0.9/MailStorm-Setup-0.0.6.exe";
    const Cubi_View_DOWNLOAD_URL = "";
    const navigate = useNavigate();

    const appData = [
        {
            id: 'wa_bomb',
            name: 'WA BOMB',
            description: 'Automate your WhatsApp messaging campaigns with powerful features and analytics.',
            icon: <Smartphone size={40} className="text-green-400" />,
            downloadUrl: WA_BOMB_DOWNLOAD_URL,
            aboutUrl: 'https://www.cubitdynamics.com/about-wa-bomb',
            privacyUrl: 'https://www.cubitdynamics.com/privacy-policy-wa-bomb',
            contactUrl: 'https://www.cubitdynamics.com/contact-us-wa-bomb',
        },
        {
            id: 'email_storm',
            name: 'Email Storm',
            description: 'Launch effective email marketing campaigns with advanced scheduling and tracking.',
            icon: <Mail size={40} className="text-blue-400" />,
            downloadUrl: EMAIL_STORM_DOWNLOAD_URL,
            aboutUrl: 'https://www.cubitdynamics.com/about-mailstorm',
            privacyUrl: 'https://www.cubitdynamics.com/privacy-policy-mailstorm',
            contactUrl: 'https://www.cubitdynamics.com/contact-us-mailstorm',
        },
        {
            id: 'cubi-view',
            name: 'Cubi-View',
            description: 'Launch effective email marketing campaigns with advanced scheduling and tracking.',
            icon: <Mail size={40} className="text-blue-400" />,
            downloadUrl: Cubi_View_DOWNLOAD_URL,
            aboutUrl: 'https://www.cubitdynamics.com/about-cubiview',
            privacyUrl: 'https://www.cubitdynamics.com/privacy-policy-cubiview',
            contactUrl: 'https://www.cubitdynamics.com/contact-us-cubiview',
        },
    ];

    const handleBackToDashboard = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c0f16] via-[#1a1f2c] to-[#0c0f16] text-white font-sans flex flex-col items-center py-10 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
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
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-3xl p-6 lg:p-10 mb-10 shadow-2xl text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight mb-4">
                        Download Our Applications
                    </h1>
                    <p className="text-base lg:text-lg text-gray-300 max-w-2xl mx-auto">
                        Access our powerful tools by downloading and installing the application files directly to your system.
                    </p>
                </motion.div>

                {/* Application Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    {appData.map((app, index) => (
                        <motion.div
                            key={app.id}
                            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center shadow-xl transition-all duration-300 hover:shadow-purple-500/15 hover:border-purple-500/40 transform hover:scale-[1.02]"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                {app.icon}
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                                {app.name}
                            </h2>
                            <p className="text-gray-300 mb-8 max-w-md">
                                {app.description}
                            </p>

                            {/* Download Button */}
                            <a
                                href={app.downloadUrl}
                                download={`${app.name.replace(/\s/g, '_')}_App.zip`} // Suggest a clean filename
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 text-lg font-medium group"
                            >
                                <DownloadCloud size={22} className="mr-3 group-hover:animate-bounce-y" /> {/* Added subtle bounce animation */}
                                Download App
                            </a>

                            {/* App Specific Links */}
                            <div className="mt-6 pt-4 border-t border-gray-700/50 flex flex-wrap justify-center gap-4 text-sm">
                                <a href={app.aboutUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors">
                                    <Info size={16} className="mr-1" /> About {app.name}
                                </a>
                                <a href={app.privacyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors">
                                    <Info size={16} className="mr-1" /> Privacy Policy
                                </a>
                                <a href={app.contactUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors">
                                    <Info size={16} className="mr-1" /> Contact Us
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer/Instructions */}
                <motion.div
                    className="mt-16 text-center text-gray-400 bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 shadow-lg backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-xl font-semibold text-white mb-4">Installation Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-left max-w-xl mx-auto">
                        <li>Click the "Download App" button for your desired application.</li>
                        <li>The application zip file will be downloaded to your device.</li>
                        <li>Locate the downloaded zip file and extract its contents to a folder of your choice.</li>
                        <li>Follow the installation instructions within the extracted folder to set up the application.</li>
                        <li>Once installed, you can launch and begin using the app.</li>
                    </ol>
                    <p className="mt-6 text-sm">
                        If you encounter any issues during download or installation, please refer to our <a href="https://www.cubitdynamics.com/contact-us-wa-bomb" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">contact page</a> for support.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default DownloadCenter;
