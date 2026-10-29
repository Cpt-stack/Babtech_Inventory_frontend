import React, { useState, useEffect } from 'react';
import styles from './css/Checkout.module.css';
import Modal from "../components/Modal.jsx"
import API from "../services/api.js"

function Checkout() {
    const initialFormState = {
        asset_id: "",
        borrower: "",
        purpose: "Class Training",
        expected_return_time: "",
        condition_out: "Good"
    };


    const [equipmentList, setEquipmentList] = useState([]);
    const [checkoutData, setCheckedOutData] = useState(initialFormState);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("error");

    //   fetch equipnment list
    useEffect(() => {
        const Fetchequipment = async () => {
            try {
                const response = await API.get("/equipment/get")
                setEquipmentList(response.data.data);
            } catch (err) {
                showModal(
                    "error",
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Failed to load equipment list."
                );
            }
        }
        Fetchequipment();
    }, [])


    const availableEquipment = equipmentList.filter(item => item.status === "Available");

    function handleChange(e) {
        const { name, value } = e.target;
        setCheckedOutData((prev) => ({ ...prev, [name]: value }));
    }


    function showModal(type, message) {
        setModalType(type);

        if (type === "error") {
            setError(message);
            setSuccessMessage("");
        } else {
            setSuccessMessage(message);
            setError("");
        }

        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setError("");
        setSuccessMessage("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMessage("");



        if (!checkoutData.asset_id.trim() || !checkoutData.borrower.trim() || !checkoutData.expected_return_time.trim()) {
            showModal("error", "Please fill in all required fields.");
            return;
        }

        const selectedEquipment = availableEquipment.find(
            (item) => item.asset_id === checkoutData.asset_id
        );

        if (!selectedEquipment) {
            showModal("error", "Selected equipment is not available.");
            return;
        }

        const now = new Date();
        const checkout_date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const checkout_time = now.toTimeString().split(' ')[0]; // HH:MM:SS



        try {
            setIsSubmitting(true)
            const response = await API.post("/transactions/checkout", {
                equipment_id: selectedEquipment.id,
                borrower: checkoutData.borrower.trim(),
                purpose: checkoutData.purpose || "Class Training",
                checkout_date,
                checkout_time,
                expected_return_time: checkoutData.expected_return_time,
                condition_out: checkoutData.condition_out || "Good"
            })

            if (response.data?.transactionId || response.data?.data) {
                setTransactions(prev => [response.data.data || response.data, ...prev])
            }

            setEquipmentList((prev) =>
                prev.map((item) =>
                    item.asset_id === checkoutData.asset_id
                        ? { ...item, status: "Checked Out" }
                        : item
                )
            );


            showModal("success", `Successfully checked out ${checkoutData.asset_id} to ${checkoutData.borrower}.`);

            setCheckedOutData(initialFormState);

        } catch (err) {
            const errMsg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Failed to complete checkout.";

            showModal("error", errMsg);
        } finally {
            setIsSubmitting(false);
        }


    }

    useEffect(() => {

        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
        }, 3500);


        return () => clearTimeout(timer);
    }, [successMessage]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setError("")
        }, 3500);

        return () => {
            clearTimeout(timer)
        }
    }, [error])

    return (
        <div className={styles.checkoutContainer}>
            <header className={styles.header}>
                <h1>Equipment Checkout</h1>
                <p>Assign available lab equipment to instructors and students.</p>
            </header>


            <Modal isOpen={isModalOpen} type={modalType} title={modalType === "error" ? "Checkout Failed" : "Checkout Successful"} message={error || successMessage} onClose={closeModal} closeText="Close" />

            <div className={styles.formCard}>
                <form onSubmit={handleSubmit}>
                    {/* Dropdown for available items */}
                    <div className={styles.formGroup}>
                        <label htmlFor="asset_id">Select Available Hardware</label>
                        <select
                            name="asset_id"
                            id="asset_id"
                            required
                            value={checkoutData.asset_id}
                            onChange={handleChange}
                        >
                            <option value="">Choose Equipment</option>
                            {availableEquipment.map((item) => (
                                <option key={item.id} value={item.asset_id}>
                                    {item.asset_id} - {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="borrower">Borrower Full Name:</label>
                        <input
                            type="text"
                            id="borrower"
                            name="borrower"
                            value={checkoutData.borrower}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Walter Ijeoma"
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="purpose">Purpose</label>
                            <select
                                name="purpose"
                                id="purpose"
                                required
                                value={checkoutData.purpose}
                                onChange={handleChange}
                            >
                                <option value="Class Training">Class Training</option>
                                <option value="Staff Work">Staff Work</option>
                                <option value="Weekend Take-Home">Weekend Take-Home</option>
                                <option value="Lab Practical">Lab Practical</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="expected_return_time">Expected Return Time:</label>
                            <input
                                type="time"
                                id="expected_return_time"
                                name="expected_return_time"
                                value={checkoutData.expected_return_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="conditionOut">Condition at Checkout</label>
                        <select
                            name="condition_out"
                            id="condition_out"
                            required
                            value={checkoutData.condition_out}
                            onChange={handleChange}
                        >
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? "Processing Checkout..." : "Complete Checkout"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Checkout;