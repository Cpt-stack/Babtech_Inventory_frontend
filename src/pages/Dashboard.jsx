import React, { useEffect, useState } from 'react';
import styles from "./css/Dashboard.module.css";
import API from "../services/api.js";
import svg from "../assets/NoConnection-bro.svg"
import { MutatingDots } from "react-loader-spinner"
import Modal from "../components/Modal.jsx";

function Dashboard() {
  const [equipment, setEquipment] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false)


  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Fetch equipment, transactions, and overdue items in parallel
        const [equipmentRes, transactionsRes, overdueRes] = await Promise.all([
          API.get("/equipment/get"),
          API.get("/transactions"),
          API.get("/transactions/Overdue")
        ]);

        setEquipment(equipmentRes.data.data || []);
        setTransactions(transactionsRes.data.data || []);
        setOverdueCount(overdueRes.data.count ?? (overdueRes.data.data?.length || 0));
      } catch (err) {

        setError(err.response?.data?.error || err.response?.data?.message || err.message || "Failed to load dashboard data.");
        setIsModalOpen(true)
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) return (
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
      />;
    </div>
  )


  // Compute metric counts cleanly without re-render loops
  const totalItems = equipment.length;
  const availableItems = equipment.filter((item) => item.status === "Available").length;
  const checkedOutItems = equipment.filter((item) => item.status === "Checked Out").length;
  const damagedItems = equipment.filter(
    (item) => item.status === "Damaged" || item.condition === "Damaged"
  ).length;

  const metrics = [
    { id: 1, title: "Total Items", count: totalItems },
    { id: 2, title: "Available", count: availableItems },
    { id: 3, title: "Checked Out", count: checkedOutItems },
    { id: 4, title: "Damaged / Repair", count: damagedItems },
    { id: 5, title: "Overdue", count: overdueCount },
  ];

  const statusClassMap = {
    Active: styles.badgeActive,
    Completed: styles.badgeReturned,
    Returned: styles.badgeReturned,
    Damaged: styles.badgeDamaged,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return dateString.split("T")[0];
  };

  // Show only the 5 most recent transactions
  const recentActivities = transactions.slice(0, 5);

  return (
    <div className={styles.Dashboard}>
      <div className={styles.dashboardHeader}>
        <h1>Dashboard</h1>
        <p>Welcome to the Babtech Hardware Inventory Management System.</p>
      </div>

      <Modal isOpen={isModalOpen} type="error" title="Connection Problem" message={error}
            image={svg}
            onClose={() => setIsModalOpen(false)}
            closeText="Close"
        />


      <div>
        <section className={styles.metricGrid}>
          {metrics.map((metric) => (
            <div key={metric.id} className={styles.metricCard}>
              <span className={styles.metricTitle}>{metric.title}</span>
              <h3 className={styles.metricCount}>{metric.count}</h3>
            </div>
          ))}
        </section>

        <section className={styles.transactionTable}>
          <h3>Recent Activity</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Equipment Name</th>
                <th>Borrower</th>
                <th>Purpose</th>
                <th>Checkout Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.asset_id}</td>
                    <td>{activity.equipment_name || "—"}</td>
                    <td>{activity.borrower}</td>
                    <td>{activity.purpose}</td>
                    <td>
                      {formatDate(activity.checkout_date)} ({activity.checkout_time})
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${statusClassMap[activity.status] || ""}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "1.5rem" }}>
                    {loading ? "Loading transactions..." : "No recent activity recorded."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>


    </div>
  );
}

export default Dashboard;