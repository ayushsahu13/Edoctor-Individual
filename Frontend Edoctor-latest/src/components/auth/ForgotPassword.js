// import React, { useState } from "react";
// import axios from "axios";

// const ForgotPassword = () => {
//     const [email, setEmail] = useState("");
//     const [message, setMessage] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post("http://localhost:8080/api/users/forgot-password", null, {
//                 params: { email },
//             });
//             setMessage(response.data);
//         } catch (err) {
//             setMessage(err.response.data || "Error occurred. Please try again.");
//         }
//     };

//     return (
//         <div>
//             <h2>Forgot Password</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Send Reset Link</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default ForgotPassword;

// src/components/auth/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import './ForgotPassword.css'; // Import the CSS file for styling

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [formErrors, setFormErrors] = useState({ email: "" });

    const handleChange = (e) => {
        setEmail(e.target.value);
        setFormErrors({ ...formErrors, email: "" }); // Clear the error when the user starts typing
    };

    const validateForm = () => {
        let valid = true;
        const errors = { email: "" };

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email) {
            errors.email = "Email is required.";
            valid = false;
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email.";
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post("http://localhost:8080/api/users/forgot-password", null, {
                    params: { email },
                });
                setMessage(response.data);
            } catch (err) {
                setMessage(err.response?.data || "Error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="form-wrapper">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                            className={formErrors.email ? "invalid" : ""}
                        />
                        {formErrors.email && <p className="error">{formErrors.email}</p>}
                    </div>

                    <button type="submit" className="submit-btn">Send Reset Link</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
