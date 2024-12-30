

// // src/components/appointments/ScheduleAppointment.js
// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom"; // Use useParams to get the doctorId from the URL
// import { AuthContext } from "../../context/AuthContext"; // Assuming you have an AuthContext
// import './Appointments.css';

// const ScheduleAppointment = () => {
//     const { user } = useContext(AuthContext); // Get the logged-in user details
//     const { doctorId } = useParams(); // Get the doctorId from the URL
//     const [doctors, setDoctors] = useState([]);
//     const [selectedDoctor, setSelectedDoctor] = useState("");
//     const [appointmentTime, setAppointmentTime] = useState("");
//     const [reason, setReason] = useState(""); // Reason for the appointment
//     const [message, setMessage] = useState("");

//     // Fetch doctors on component load
//     useEffect(() => {
//         const fetchDoctors = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8080/api/doctors");
//                 setDoctors(response.data);

//                 // Set the selected doctor based on doctorId from the URL
//                 const doctor = response.data.find(doc => doc.id === parseInt(doctorId));
//                 if (doctor) {
//                     setSelectedDoctor(doctor.name);
//                 }
//             } catch (error) {
//                 console.error("Error fetching doctors", error);
//             }
//         };
//         fetchDoctors();
//     }, [doctorId]); // Depend on doctorId to fetch doctor details

//     const handleSchedule = async () => {
//         const payload = {
//             doctorName: selectedDoctor,
//             username: user.username, // Use the logged-in user's username
//             appointmentTime,
//             reason, // Include reason in payload
//         };

//         try {
//             // Add Basic Authentication header
//             const authHeader = {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`, // Encode credentials in Base64
//                 },
//             };

//             const response = await axios.post(
//                 "http://localhost:8080/api/appointments/schedule",
//                 payload,
//                 authHeader
//             );
//             setMessage("Appointment scheduled successfully!");
//         } catch (error) {
//             console.error("Error scheduling appointment:", error);
//             if (error.response && error.response.status === 401) {
//                 setMessage("Unauthorized. Please log in.");
//             } else {
//                 setMessage("Failed to schedule appointment.");
//             }
//         }
//     };

//     return (
//         <div className="schedule-appointment">
//             <h2>Schedule Appointment</h2>
//             <select onChange={(e) => setSelectedDoctor(e.target.value)} value={selectedDoctor}>
//                 <option value="">Select Doctor</option>
//                 {doctors.map((doctor) => (
//                     <option key={doctor.id} value={doctor.name}>
//                         {doctor.name}
//                     </option>
//                 ))}
//             </select>
//             <input className="inputfields"
//                 type="datetime-local"
//                 onChange={(e) => setAppointmentTime(e.target.value)}
//                 required
//             />
//             <input className="inputfields"
//                 type="text"
//                 placeholder="Reason for appointment"
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 required
//             />
//             <button onClick={handleSchedule}>Schedule Appointment</button>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default ScheduleAppointment;



import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Use useParams to get the doctorId from the URL
import { AuthContext } from "../../context/AuthContext"; // Assuming you have an AuthContext
import PaymentForm from "../auth/PaymentForm"; // Import the PaymentForm component
import "./Appointments.css";

const ScheduleAppointment = () => {
    const { user } = useContext(AuthContext); // Get the logged-in user details
    const { doctorId } = useParams(); // Get the doctorId from the URL
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [reason, setReason] = useState("");
    const [paymentId, setPaymentId] = useState(""); // Store payment ID after payment success
    const [message, setMessage] = useState("");

    // Fetch doctors on component load
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/doctors");
                setDoctors(response.data);

                // Set the selected doctor based on doctorId from the URL
                const doctor = response.data.find((doc) => doc.id === parseInt(doctorId));
                if (doctor) {
                    setSelectedDoctor(doctor.name);
                }
            } catch (error) {
                console.error("Error fetching doctors", error);
            }
        };
        fetchDoctors();
    }, [doctorId]);

    const handlePaymentSuccess = (paymentId) => {
        setPaymentId(paymentId); // Save payment ID after successful payment
        alert("Payment successful! You can now schedule your appointment.");
    };

    const handleSchedule = async () => {
        if (!paymentId) {
            alert("Please complete the payment before scheduling the appointment.");
            return;
        }

        const payload = {
            doctorName: selectedDoctor,
            username: user.username, // Use the logged-in user's username
            appointmentTime,
            reason, // Include reason in payload
            paymentId, // Pass the payment ID to the backend
        };

        try {
            const authHeader = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`, // Encode credentials in Base64
                },
            };

            const response = await axios.post(
                "http://localhost:8080/api/appointments/schedule",
                payload,
                authHeader
            );
            setMessage("Appointment scheduled successfully!");
        } catch (error) {
            console.error("Error scheduling appointment:", error);
            setMessage("Failed to schedule appointment.");
        }
    };

    return (
        <div className="schedule-appointment">
            <h2>Schedule Appointment</h2>
            <select
                onChange={(e) => setSelectedDoctor(e.target.value)}
                value={selectedDoctor}
            >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                        {doctor.name}
                    </option>
                ))}
            </select>
            <input
                className="inputfields"
                type="datetime-local"
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
            />
            <input
                className="inputfields"
                type="text"
                placeholder="Reason for appointment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
            />
            {!paymentId && (
                <PaymentForm amount={50} onSuccess={handlePaymentSuccess} />
            )}
            <button
                onClick={handleSchedule}
                disabled={!paymentId} // Disable the button until payment is successful
            >
                Schedule Appointment
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ScheduleAppointment;
