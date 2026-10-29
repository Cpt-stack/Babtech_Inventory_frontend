import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from "./css/Auth.module.css";
import API from "../services/api.js";
import Logo from "../assets/Babtech.png";
import svg from "../assets/StudentPicture.jpg";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    function handleInputChange(e) {
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
        setLoading(true);

        try {
            const response = await API.post("/auth/login", {
                email: formData.email.trim(),
                password: formData.password
            });

            localStorage.setItem("token", response.data.token);

            localStorage.setItem(
                "currentUser",
                JSON.stringify(response.data.user)
            );

            setSuccess("Login successful! Redirecting...");
            setIsModalOpen(true);

            setTimeout(() => {
                navigate("/");
            }, 1200);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Login failed. Check your credentials."
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
                <div className={styles.authContainerImageWriteup}>
                    <h1>Babtech Hardware Inventory</h1>

                    <p>
                        Sign in to access Your dashboard, manage
                        hardware inventory ,track equipment, and keep
                        everything running smootly
                    </p>
                </div>
            </div>

            {/* Error/Success Modal */}
            {isModalOpen && (
                <div
                    className={styles.modal}
                    onClick={closeModal}
                >
                    <div className={styles.modalCard} role="alertdialog" aria-modal="true" aria-labelledby="login-modal-title" onClick={(e) => e.stopPropagation()}  >
                        <h3
                            id="login-modal-title"
                            className={styles.modalTitle} > {error ? "Login Failed" : "Login Successful"}  </h3>

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

            <div className={styles.authCardContainer}>
                <div className={styles.authCard}>

                    <div className={styles.authCardLogo}>
                        <span className={styles.Imgspan}>
                            <img src={Logo} alt="Babtech Logo" />
                        </span>
                    </div>

                    <h2>Welcome Back</h2>

                    <p className={styles.subtitle}>
                        Sign in to access Babtech Hardware Inventory
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g user@gmail.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Login"}
                        </button>

                        <p className={styles.authFooter}>
                            <Link to="/forgotPassword">
                                Forgot Password?
                            </Link>
                        </p>

                        <p className={styles.authFooter}>
                            Don't have an account?{" "}
                            <Link to="/register">
                                Register here
                            </Link>
                        </p>

                        <p className={styles.authFooter}>
                            Made By: Israel Brian 240591398
                        </p>

                    </form>
                </div>
            </div>

        </div>
    );

}

export default Login;