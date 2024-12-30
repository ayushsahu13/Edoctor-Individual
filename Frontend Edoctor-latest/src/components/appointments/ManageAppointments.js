// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";
// import './ManageAppointments.css';

// const ManageAppointments = () => {
//     const { user } = useContext(AuthContext); // Access user from AuthContext
//     const [appointments, setAppointments] = useState([]);
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         const fetchAppointments = async () => {
//             if (!user) {
//                 setMessage("User not logged in.");
//                 return;
//             }

//             try {
//                 let response;
//                 if (user.role === "DOCTOR") {
//                     response = await axios.get(
//                         `http://localhost:8080/api/appointments/doctor/${user.username}`,
//                         {
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`,
//                             },
//                         }
//                     );
//                 } else if (user.role === "PATIENT") {
//                     response = await axios.get(
//                         `http://localhost:8080/api/appointments/user/${user.username}`,
//                         {
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`,
//                             },
//                         }
//                     );
//                 }

//                 setAppointments(response.data || []); // Ensure the response is an array
//             } catch (error) {
//                 console.error("Error fetching appointments:", error);
//                 setMessage("Failed to fetch appointments. Please try again later.");
//             }
//         };

//         fetchAppointments();
//     }, [user]);

//     const handleConfirm = async (id) => {
//         try {
//             await axios.post(`http://localhost:8080/api/appointments/confirm/${id}`, {}, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`,
//                 },
//             });
//             setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: "CONFIRMED" } : app));
//             setMessage("Appointment confirmed!");
//         } catch (error) {
//             console.error("Error confirming appointment:", error);
//             setMessage("Failed to confirm appointment.");
//         }
//     };

//     const handleReject = async (id) => {
//         try {
//             await axios.post(`http://localhost:8080/api/appointments/reject/${id}`, {}, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`,
//                 },
//             });
//             setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: "REJECTED" } : app));
//             setMessage("Appointment rejected!");
//         } catch (error) {
//             console.error("Error rejecting appointment:", error);
//             setMessage("Failed to reject appointment.");
//         }
//     };

//     if (!user) {
//         return <p>Loading... Please log in to view appointments.</p>;
//     }

//     return (
//         <div className="manage-appointments">
//             <h2>Your Appointments</h2>
//             {message && <p className="error">{message}</p>}
//             {appointments.length > 0 ? (
//                 <ul className="appointment-list">
//                     {appointments.map((appointment) => (
//                         <li key={appointment.id}>
//                             <strong>{user.role === "DOCTOR" ? "Patient:" : "Doctor:"}</strong>{" "}
//                             {user.role === "DOCTOR"
//                                 ? appointment.user.username || "Unknown"
//                                 : appointment.doctor.name || "Unknown"} <br />
//                             <strong>Time:</strong>{" "}
//                             {appointment.appointmentTime
//                                 ? new Date(appointment.appointmentTime).toLocaleString()
//                                 : "No time provided"} <br />
//                             <strong>Status:</strong> {appointment.status} <br />
//                             {user.role === "DOCTOR" && appointment.status === "PENDING" && (
//                                 <>
//                                     <button onClick={() => handleConfirm(appointment.id)}>Confirm</button>
//                                     <button onClick={() => handleReject(appointment.id)}>Reject</button>
//                                 </>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No appointments available.</p>
//             )}
//         </div>
//     );
// };

// export default ManageAppointments;


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Assuming you have an AuthContext
import './ManageAppointments.css';

const ManageAppointments = () => {
    const { user } = useContext(AuthContext); // Access user from AuthContext
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user) {
                setMessage("User not logged in.");
                return;
            }

            try {
                let response;
                if (user.role === "DOCTOR") {
                    response = await axios.get(
                        `http://localhost:8080/api/appointments/doctor/${user.username}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`,
                            },
                        }
                    );
                } else if (user.role === "PATIENT") {
                    response = await axios.get(
                        `http://localhost:8080/api/appointments/user/${user.username}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`,
                            },
                        }
                    );
                }

                setAppointments(response.data || []); // Ensure the response is an array
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setMessage("Failed to fetch appointments. Please try again later.");
            }
        };

        fetchAppointments();
    }, [user]);

    const handleConfirm = async (id) => {
        try {
            await axios.post(`http://localhost:8080/api/appointments/confirm/${id}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`,
                },
            });
            setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: "CONFIRMED" } : app));
            setMessage("Appointment confirmed!");
        } catch (error) {
            console.error("Error confirming appointment:", error);
            setMessage("Failed to confirm appointment.");
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`http://localhost:8080/api/appointments/reject/${id}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`,
                },
            });
            setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: "REJECTED" } : app));
            setMessage("Appointment rejected!");
        } catch (error) {
            console.error("Error rejecting appointment:", error);
            setMessage("Failed to reject appointment.");
        }
    };

    if (!user) {
        return <p>Loading... Please log in to view appointments.</p>;
    }

    return (
        <div className="manage">
            <div className="manage-appointments">
                <h2>Your Appointments</h2>
                {message && <p className="error">{message}</p>}
                {appointments.length > 0 ? (
                    <ul className="appointment-list">
                        {appointments.map((appointment) => (
                            <li key={appointment.id}>
                                <strong>{user.role === "DOCTOR" ? "Patient:" : "Doctor:"}</strong>{" "}
                                <span className={user.role === "DOCTOR" ? "patient-name" : "doctor-name"}>
                                    {user.role === "DOCTOR" ? appointment.user.username || "Unknown" : appointment.doctor.name || "Unknown"}
                                </span>
                                <br />
                                <strong>Time:</strong>{" "}
                                <span className="appointment-time">
                                    {appointment.appointmentTime
                                        ? new Date(appointment.appointmentTime).toLocaleString()
                                        : "No time provided"}
                                </span>
                                <br />
                                <strong>Status:</strong>
                                <span className="status">{appointment.status}</span>
                                <br />
                                {user.role === "DOCTOR" && appointment.status === "PENDING" && (
                                    <>
                                        <button onClick={() => handleConfirm(appointment.id)}>Confirm</button>
                                        <button onClick={() => handleReject(appointment.id)}>Reject</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No appointments available.</p>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
