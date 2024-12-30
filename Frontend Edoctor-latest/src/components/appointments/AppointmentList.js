// src/components/appointments/AppointmentList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/appointments/user/john_doe");
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments", error);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div>
            <h2>Your Appointments</h2>
            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment.id}>
                        {appointment.doctor.name} - {appointment.appointmentTime}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmentList;