import React, { useEffect, useState } from "react";
import API from "../services/api.js";
import { getCurrentUser } from "../utils/auth.js";
import styles from "./css/Admin.module.css";
import { MutatingDots } from "react-loader-spinner"

function Admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [notification, setNotification] = useState("");

    const currentUser = getCurrentUser();

    // 1. Fetch all users on mount
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await API.get("/auth/users");
            setUsers(response.data.users || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load users list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Handle changing a user's role
    const handleRoleChange = async (targetUserId, newRole) => {
        try {
            setUpdatingId(targetUserId);
            setError("");
            setNotification("");

            const response = await API.patch(`/auth/${targetUserId}/role`, {
                role: newRole
            });

            // Update user in local state immediately
            setUsers(prev =>
                prev.map(u => (u.id === targetUserId ? { ...u, role: newRole } : u))
            );

            setNotification(response.data.message || `Updated role to ${newRole}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update role.");
        } finally {
            setUpdatingId(null);
        }
    };

    // Auto-dismiss notifications
    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => setNotification(""), 4000);
        return () => clearTimeout(timer);
    }, [notification]);

    return (
        <div className={styles.adminContainer}>
            <div className={styles.headerArea}>
                <h2>Admin Management</h2>
                <p>Authorize roles and grant administrative access to staff & students.</p>
            </div>

            {notification && <div className={styles.successToast}>{notification}</div>}
            {error && <div className={styles.errorToast}>{error}</div>}

            {loading ? (
                <div className={styles.loader}>
                    <MutatingDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#15616d"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{ margin: '20px' }}
                        wrapperClass="custom-loader"
                        visible={true}
                    />
                </div>
            ) : (
                <div className={styles.tableCard}>
                    <table className={styles.usersTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Current Role</th>
                                <th>Assign Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => {
                                const isSelf = currentUser?.id === u.id;

                                return (
                                    <tr key={u.id}>
                                        <td className={styles.userName}>
                                            {u.full_name} {isSelf && <span className={styles.youBadge}>(You)</span>}
                                        </td>
                                        <td className={styles.userEmail}>{u.email}</td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${styles[u.role.toLowerCase()]}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={u.role}
                                                disabled={updatingId === u.id || isSelf}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className={styles.roleSelect}
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Technician">Technician</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                            {updatingId === u.id && <span className={styles.updatingText}>Saving...</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Admin;