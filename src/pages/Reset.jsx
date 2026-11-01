import React, { useEffect, useState } from 'react'
import styles from "./css/Auth.module.css"
import { Link, useNavigate, useParams } from "react-router-dom";
import Logo from "../assets/Babtech.png"
import API from '../services/api';
// import 

function Reset() {
    const [Password, setPassowrd] = useState({
        password: "",
        confirmPasword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const { token } = useParams();
    const navigate = useNavigate();

    function handleInputChange(e) {
        const { name, value } = e.target;
        setPassowrd(prev => ({ ...prev, [name]: value }))
    }



    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");


        if (!Password.password.trim() || !Password.confirmPasword.trim()) {
            setError("Please fill in both password fields.");
            return;
        }

        if (Password.password !== Password.confirmPasword) {
            setError("Please make sure both passwords match.");
            return;
        }

        if (Password.password.length < 6) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post(`/auth/reset/${token}`, {
                password: Password.password
            });
            setSuccess(response.data.message || "Password reset successfully!");
            setPassowrd({ password: "", confirmPasword: "" });

            setTimeout(() => {
                navigate("/login");

            }, 2000);
        } catch (error) {

            setError(error.response?.data?.message || "Unable to reset your password. Your reset link may have expired.");

        } finally {
            setLoading(false);
        }
    }
    return (
        <div>

            <div className={styles.authContainer}>


                {/* <div className={styles.authContainerImage}>
                    <img src={svg} alt="Display Image" />

                </div> */}

                <div className={styles.authCardContainer}>

                    <div className={styles.authCard}>

                        <div className={styles.authCardLogo}>
                            <span className={styles.Imgspan}> <img src={Logo} alt="Babtech Logo" /></span>
                        </div>

                        <h2>Reset Password</h2>
                        <p className={styles.subtitle}>Enter your new password below.</p>


                        {error && <div className={styles.errorMessage}>{error}</div>}
                        {success && <div className={styles.successMessage}>{success}</div>}

                        <form action="" onSubmit={handleSubmit}>

                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password</label>
                                <input type="password" required name="password" value={Password.password} onChange={handleInputChange} placeholder="Enter your password" />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password">Confirm Password</label>
                                <input type="password" required name="confirmPasword" value={Password.confirmPasword} onChange={handleInputChange} placeholder="Enter your password" />
                            </div>

                            <button type='submit' className={styles.submitBtn} disabled={loading}>{loading ? "Signing in..." : "Login"}</button>


                            <p className={styles.authFooter}> Remember your password?{" "} <Link to="/login">Login here</Link> </p>
                            <p className={styles.authFooter}>Made By : Israel Brian 240591398</p>
                        </form>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Reset