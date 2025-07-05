import React, { useState, useEffect } from 'react';
import { ChevronRight, Download, Mail, MessageSquare, Key, Menu, X } from 'lucide-react'; // Removed DollarSign as pricing is removed
import { Link } from 'react-router-dom';

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Handles scroll event to change navigation bar style
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scrolls to a specific section on the page
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false); // Close mobile menu after clicking a link
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] text-white font-sans">
            {/* Navigation Bar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[rgba(30,30,30,0.9)] backdrop-blur-md py-3 shadow-lg border-b border-gray-800' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand Name */}
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-white">
                                <span className="text-[#6a5acd]">Campaign</span>Keys Pro
                            </span>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={() => scrollToSection('features')} className="hover:text-[#6a5acd] transition-colors duration-300 text-lg">Features</button>
                            <button onClick={() => scrollToSection('workflow')} className="hover:text-[#6a5acd] transition-colors duration-300 text-lg">How It Works</button>
                            {/* Removed Pricing link from navigation */}
                        </div>

                        {/* Desktop Action Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to={"/download-apps"} className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] flex items-center justify-center">
                                <Download className="mr-2 h-5 w-5" /> Download Apps
                            </Link>
                            <Link to={"/login"} className="bg-transparent border border-[#6a5acd] hover:bg-[#6a5acd]/20 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)]">
                                Login
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white hover:text-[#6a5acd] transition-colors duration-300"
                            >
                                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
                            <div className="flex flex-col space-y-4 pt-4">
                                <button onClick={() => scrollToSection('features')} className="text-left hover:text-[#6a5acd] transition-colors duration-300 text-lg">Features</button>
                                <button onClick={() => scrollToSection('workflow')} className="text-left hover:text-[#6a5acd] transition-colors duration-300 text-lg">How It Works</button>
                                {/* Removed Pricing link from mobile navigation */}
                                <Link to={"/download-apps"} className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] w-full text-center flex items-center justify-center">
                                    <Download className="mr-2 h-5 w-5" /> Download Apps
                                </Link>
                                <Link to={"/login"} className="bg-transparent border border-[#6a5acd] hover:bg-[#6a5acd]/20 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] w-full text-center">
                                    Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 pb-10"> {/* Adjusted padding-bottom for mobile */}
                {/* Background effects */}
                {/* <div className="absolute inset-0 bg-[url('https://placehold.co/1200x800/1a1a2e/ffffff?text=Abstract+Circuit+Board')] bg-center bg-no-repeat bg-cover opacity-10"></div> */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#6a5acd]/10 to-transparent"></div>

                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"> {/* Removed min-h-0 */}
                        {/* Hero Text Content */}
                        <div className="text-center lg:text-left order-2 lg:order-1">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Unlock Your Campaigns with <span className="text-[#6a5acd] block sm:inline">Powerful Activation Keys</span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                                Generate secure activation keys for WA BOMB, Email Storm and Cubi-View – your go-to tools for effective business advertising and marketing campaigns.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to={"/download-apps"} className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] flex items-center justify-center">
                                    <Download className="mr-2 h-5 w-5" /> Download Apps
                                </Link>
                                {/* Removed 'View Pricing' button */}
                            </div>
                        </div>

                        {/* Hero Image / Placeholder */}
                        <div className="order-1 lg:order-2">
                            <div className="relative max-w-lg mx-auto lg:max-w-none">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#6a5acd] to-[#4a3a8d] rounded-2xl blur opacity-30"></div>
                                <div className="relative bg-[rgba(30,30,30,0.8)] backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-gray-800">
                                    <img
                                        src="https://placehold.co/600x400/2a2a3e/ffffff?text=Apps+Dashboard"
                                        alt="WA BOMB & Mail Storm Dashboard Preview"
                                        className="rounded-lg shadow-lg w-full h-auto"
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/2a2a3e/ffffff?text=Apps+Preview" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[rgba(30,30,30,0.3)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
                        {[
                            { number: '1M+', label: 'Messages Sent' },
                            { number: '500K+', label: 'Emails Delivered' },
                            { number: '10K+', label: 'Campaigns Launched' },
                            { number: '99%', label: 'Delivery Rate' }
                        ].map((stat, index) => (
                            <div key={index} className="p-4 sm:p-6">
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6a5acd] mb-2">{stat.number}</p>
                                <p className="text-sm sm:text-base text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Key Features of Our Apps</h2>
                        <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                            Powerful tools designed for mass communication and efficient campaign management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            {
                                icon: MessageSquare,
                                title: 'WA BOMB - Bulk Messaging',
                                description: 'Send automated WhatsApp messages to large contact lists for marketing and notifications. Streamline your communication efforts.'
                            },
                            {
                                icon: Mail,
                                title: 'Mail Storm - Mass Emailing',
                                description: 'Launch high-volume email campaigns with personalized content and advanced scheduling options for business advertising.'
                            },
                            {
                                icon: Key,
                                title: 'Instant Key Generation',
                                description: 'Securely generate and manage unique activation keys for both WA BOMB and Mail Storm applications with ease.'
                            },
                            {
                                icon: Download,
                                title: 'Easy App Downloads',
                                description: 'Quickly access and download the latest versions of WA BOMB and Mail Storm directly from our platform.'
                            },
                        ].map((feature, index) => (
                            <div key={index} className="bg-[rgba(30,30,30,0.5)] backdrop-blur-md border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] hover:transform hover:scale-105">
                                <div className="mb-4">
                                    <div className="inline-flex items-center justify-center bg-[#6a5acd]/20 p-3 rounded-lg">
                                        <feature.icon className="h-8 w-8 text-[#6a5acd]" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-[#111827] to-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                            Get started with your campaigns in a few simple steps.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting line - hidden on mobile, visible on larger screens */}
                        <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-[#6a5acd] via-[#6a5acd]/30 to-[#6a5acd] transform -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative z-10">
                            {[
                                { title: 'Download Apps', description: 'Get WA BOMB & Mail Storm from our site.' },
                                { title: 'Login / Get Key', description: 'Log in to your account and generate an activation key.' },
                                { title: 'Activate Software', description: 'Use the generated key to activate your downloaded application.' },
                                { title: 'Configure Campaign', description: 'Set up your messaging or email campaign within the app.' },
                                { title: 'Launch & Monitor', description: 'Execute your campaign and track performance in real-time.' }
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <div className="absolute -inset-1 bg-[#6a5acd] rounded-full blur-sm opacity-70"></div>
                                        <div className="relative w-16 h-16 flex items-center justify-center bg-[rgba(30,30,30,0.8)] backdrop-blur-md text-[#6a5acd] text-xl font-bold rounded-full border-2 border-[#6a5acd]">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-400 max-w-xs">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Removed Pricing Section */}

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#111827] via-black to-[#10151b]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Ready to Power Your Campaigns?</h2>
                    <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
                        Download WA BOMB, Mail Storm and Cubi-View today and revolutionize your business advertising and outreach efforts.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to={"/download-apps"} className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] w-full sm:w-auto flex items-center justify-center">
                            <Download className="mr-2 h-5 w-5" /> Download Apps
                        </Link>
                        {/* Removed 'View Pricing' button from CTA */}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[rgba(30,30,30,0.5)] backdrop-blur-md border-t border-gray-800 text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
                        {[
                            {
                                title: 'Company',
                                links: ['About', 'Careers', 'Blog', 'News']
                            },
                            {
                                title: 'Products',
                                links: ['WA BOMB', 'Mail Storm', 'Key Generator', 'API Documentation']
                            },
                            {
                                title: 'Support',
                                links: ['Help Center', 'Contact Us', 'FAQs', 'Community Forum']
                            },
                            {
                                title: 'Legal',
                                links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
                            }
                        ].map((section, index) => (
                            <div key={index}>
                                <h4 className="font-bold text-base sm:text-lg mb-4">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <a href="#" className="text-sm sm:text-base text-gray-400 hover:text-[#6a5acd] transition-colors duration-300">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-gray-800 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center">
                            <span className="text-xl sm:text-2xl font-bold">
                                <span className="text-[#6a5acd]">Campaign</span>Keys Pro
                            </span>
                        </div>
                        <div className="flex space-x-6">
                            {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map(platform => (
                                <a
                                    key={platform}
                                    href="#"
                                    className="text-sm sm:text-base text-gray-400 hover:text-[#6a5acd] transition-colors duration-300"
                                >
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-xs sm:text-sm mt-8">&copy; {new Date().getFullYear()} CampaignKeys Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
