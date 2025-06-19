import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DeviceDetails from './pages/DeviceDetails';
import DownloadCenter from './components/DownloadCenter';

const App = () => {
    const isAuth = useSelector((s) => s.auth.isAuthenticated);
    const isAdmin = useSelector((s) => s.auth.isAdmin);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    // element={!isAuth ? <LoginPage /> : isAdmin ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/dashboard"} />}
                    element={<LoginPage />}
                />
                <Route
                    path="/register"
                    // element={!isAuth ? <RegistrationPage /> : isAdmin ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/dashboard"} />}
                    element={<RegistrationPage />}
                />
                <Route
                    path="/reset-password/:token"
                    // element={!isAuth ? <ResetPassword /> : isAdmin ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/dashboard"} />}
                    element={<ResetPassword />}
                />
                <Route
                    path="forgot-password"
                    // element={!isAuth ? <ForgotPassword /> : isAdmin ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/dashboard"} />}
                    element={<ForgotPassword />}
                />
                <Route 
                    path="/dashboard"
                    // element={isAuth ? <Dashboard /> : <Navigate to={"/login"} />}
                    element={<Dashboard />}
                />
                <Route
                    path="/device/:macId"
                    // element={isAuth ? <DeviceDetails /> : <Navigate to={"/login"} />}
                    element={<DeviceDetails />}
                />
                <Route
                    path = "/download-apps"
                    element={<DownloadCenter /> }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App