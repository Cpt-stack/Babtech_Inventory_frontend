import React, { useState } from 'react';
import styles from "./css/Auth.module.css";
import { useNavigate, Link } from 'react-router-dom';
import API from "../services/api.js";
import Logo from "../assets/Babtech.png";
import svg from "../assets/Signup-rafiki.svg";

function Register() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Student"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setIsModalOpen(true);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password should have at least 6 characters.");
            setIsModalOpen(true);
            return;
        }

        if (!formData.email.includes("@")) {
            setError("The email must include the @ symbol.");
            setIsModalOpen(true);
            return;
        }

        setLoading(true);

        try {
            const response = await API.post("/auth/register", {
                full_name: formData.full_name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role
            });

            setSuccess(
                response.data.message ||
                "Registration successful! Redirecting to login..."
            );

            setIsModalOpen(true);

            setFormData({
                full_name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "Student"
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Registration unsuccessful. Please try again."
            );

            setIsModalOpen(true);


        } finally {
            setLoading(false);
        }
    }

    function closeModal() {
        setIsModalOpen(false);
        setError("");
        setSuccess("");
    }

    return (
        <div className={styles.authContainer}>

            <div className={styles.authContainerImage}>
                <img src={svg} alt="Display Image" />
            </div>

            {/* Error/Success Modal */}
            {isModalOpen && (
                <div
                    className={styles.modal}
                    onClick={closeModal}
                >
                    <div
                        className={styles.modalCard}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="register-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            id="register-modal-title"
                            className={styles.modalTitle}
                        >
                            {error ? "Registration Failed" : "Registration Successful"}
                        </h3>

                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className={styles.successMessage}>
                                {success}
                            </div>
                        )}

                        {error && (
                            <button
                                type="button"
                                className={styles.modalCloseBtn}
                                onClick={closeModal}
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.authCard}>

                <div className={styles.authCardLogo}>
                    <span className={styles.Imgspan}>
                        <img src={Logo} alt="Babtech Logo" />
                    </span>
                </div>

                <h2>Create an Account</h2>

                <p className={styles.subtitle}>
                    Register to access Babtech Hardware Inventory
                </p>

                <form onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                        <label htmlFor="full_name">Full Name</label>

                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            placeholder="Walter Ijeoma"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="e.g user@gmail.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Re-type password"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="role">Account Role</label>

                        <select
                            name="role"
                            id="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="Student">Student</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className={styles.authFooter}>
                        Already have an account?{" "}
                        <Link to="/login">Sign In</Link>
                    </p>

                    <p className={styles.authFooter}>
                        Made By: Israel Brian 240591398
                    </p>

                </form>
            </div>
        </div>
    );

}

export default Register;