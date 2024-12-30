// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Register from "./components/auth/Register";
// import OtpVerification from "./components/auth/OtpVerification";
// import Login from "./components/auth/Login";
// import PatientDashboardPage from "./pages/PatientDashboardPage";
// import DoctorDashboardPage from "./pages/DoctorDashboardPage";
// import ScheduleAppointment from "./components/appointments/ScheduleAppointment";
// import ManageAppointments from "./components/appointments/ManageAppointments";
// import DoctorList from "./components/doctors/DoctorList";
// import Profile from "./components/dashboard/Profile";
// import SetAvailability from "./components/doctors/SetAvailability";
// import ProtectedRoute from "./components/common/ProtectedRoute";
// import Navbar from "./components/common/Navbar";
// import { AuthProvider } from "./context/AuthContext";
// import ForgotPassword from "./components/auth/ForgotPassword";
// import ResetPassword from "./components/auth/ResetPassword";
// import "./styles/Global.css";
// import Chatbot from "./components/common/Chatbot";
// import { useState, useEffect } from "react";
// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     console.log(user); // Check if user is saved in localStorage
//     setIsLoggedIn(user !== null);
//   }, []);

//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/verify-otp" element={<OtpVerification />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
//           <Route
//             path="/patient-dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["PATIENT"]}>
//                 <PatientDashboardPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/doctor-dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["DOCTOR"]}>
//                 <DoctorDashboardPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/appointments/schedule/:doctorId"
//             element={
//               <ProtectedRoute allowedRoles={["PATIENT"]}>
//                 <ScheduleAppointment />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/appointments/schedule"
//             element={
//               <ProtectedRoute allowedRoles={["PATIENT"]}>
//                 <ScheduleAppointment />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/appointments/manage" element={
//             <ProtectedRoute allowedRoles={["DOCTOR", "PATIENT"]}>
//               <ManageAppointments />
//             </ProtectedRoute>
//           } />
//           <Route
//             path="/doctors"
//             element={
//               <ProtectedRoute allowedRoles={["PATIENT"]}>
//                 <DoctorList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute allowedRoles={["PATIENT", "DOCTOR"]}>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/availability"
//             element={
//               <ProtectedRoute allowedRoles={["DOCTOR"]}>
//                 <SetAvailability />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//         <Chatbot />

//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Home from "./pages/Home";
import Register from "./components/auth/Register";
import OtpVerification from "./components/auth/OtpVerification";
import Login from "./components/auth/Login";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import ScheduleAppointment from "./components/appointments/ScheduleAppointment";
import ManageAppointments from "./components/appointments/ManageAppointments";
import DoctorList from "./components/doctors/DoctorList";
import Profile from "./components/dashboard/Profile";
import SetAvailability from "./components/doctors/SetAvailability";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import "./styles/Global.css";
import Chatbot from "./components/common/Chatbot";
import { useState, useEffect } from "react";

const stripePromise = loadStripe("pk_test_51QXeFTFDMIdA4FuzzsO4Jmq7VpE2mqwCoPpMamfMS8beedzDkTLm66Mka5RNBtBkQcWxK3eV5kAE5IhVbibgqdT500SomfnAXX"); // Replace with your Stripe publishable key

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log(user); // Check if user is saved in localStorage
    setIsLoggedIn(user !== null);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <PatientDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/schedule/:doctorId"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <Elements stripe={stripePromise}>
                  <ScheduleAppointment />
                </Elements>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/manage"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR", "PATIENT"]}>
                <ManageAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <DoctorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["PATIENT", "DOCTOR"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/availability"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <SetAvailability />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Chatbot />
      </Router>
    </AuthProvider>
  );
};

export default App;
