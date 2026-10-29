import React, { useState, useEffect, use } from 'react'
import styles from "./css/Return.module.css"
import API from "../services/api"
import Modal from "../components/Modal.jsx";

function Return() {

    const [activeLoans, setActiveLoan] = useState([]);
    const [returnData, setReturnData] = useState({
        asset_id: "",
        condition_in: "Good",
        damage_description: "",
        remarks: ""
    });
    const [selectedLoan, setSelectedloan] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalType, setModalType] = useState("error");
    const [isModalOpen, setIsModalOpen] = useState(false)



    useEffect(() => {
        if (!successMessage) return;
        const timer = setTimeout(() => {
            setSuccessMessage("")
        }, 3500);

        return () => {
            clearTimeout(timer)
        }
    }, [successMessage]);


    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => {
            setError("")
        }, 3500)

        return () => {
            clearTimeout(timer)
        }
    }, [error])


    useEffect(() => {

        async function getTransaction() {
            try {
                const response = await API.get("/transactions")
                setActiveLoan(response.data.data)
            } catch (error) {
                showModal("error",
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Failed to Fetch active transactions")
                console.log(error)
            }
        }

        getTransaction()
    }, [])


    const formatDate = (dateString) => {
        if (!dateString) return "—";
        // Grabs only the YYYY-MM-DD part before the 'T'
        return dateString.split("T")[0];
    };

    const checkedOutLoan = activeLoans.filter(item => item.status === "Active")

    function handleAssetSelect(e) {
        const selectedId = e.target.value;

        setReturnData((prev) => ({ ...prev, asset_id: selectedId }));

        const foundLoan = activeLoans.find((item) => item.asset_id === selectedId);
        setSelectedloan(foundLoan || null);
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
    }

    function closeModal() {
        setIsModalOpen(false);
        setError("");
        setSuccessMessage("");
    }



    function handleChange(e) {
        const { name, value } = e.target;

        setReturnData(prev => ({ ...prev, [name]: value }));

    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMessage("")

        if (!returnData.asset_id) {
            showModal("error", "Please select an equipment item to return.");
            return;
        }



        if (!selectedLoan) {
            showModal("error", "Could not locate active loan record for this item.");
            return;
        }

        if (returnData.condition_in === "Damaged" && !returnData.damage_description.trim()) {
            showModal("error", "Please describe the demage before processing");
            return;
        }

        const now = new Date();
        const return_date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const return_time = now.toTimeString().split(' ')[0]; // HH:MM:SS

        try {

            setIsSubmitting(true);

            const response = await API.post("/transactions/return", {
                transaction_id: selectedLoan.id,
                equipment_id: selectedLoan.equipment_id,
                asset_id: returnData.asset_id,
                return_date,
                return_time,
                condition_in: returnData.condition_in,
                damage_description: returnData.damage_description,
                remarks: returnData.remarks|| returnData.damage_description || ""
            });

            setActiveLoan((prev) => prev.filter((item) => item.id !== selectedLoan.id));

            showModal(
                "success",
                `Asset ID ${returnData.asset_id} has been returned successfully.`
            );

            setReturnData({
                asset_id: "",
                condition_in: "Good",
                damage_description: "",
                remarks: ""
            });
            setSelectedloan(null);

        } catch (err) {
            const errMsg = err.response?.data?.error || err.response?.data?.message || "Failed to fetch active transactions.";

            setModalType("error", errMsg)
        }
        finally {
            setIsSubmitting(false)

        }


    }

    return (
        <div className={styles.returnContainer}>
            <header>
                <h1>Equipment Return & Inspection</h1>
                <p>Inspect returned hardware, report device health, and restore items to active inventory.</p>
            </header>

            <Modal isOpen={isModalOpen} type={modalType} title ={ modalType === "error" ? "Return Failed" : "Return Successfully"} message={error || successMessage} onClose={closeModal} closeText= "close"/>


            <div className={styles.formCard}>

                <form action="" onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="assetID">Asset ID</label>
                        <select name="asset_id" value={returnData.asset_id} onChange={handleAssetSelect} required id='asset_id'>

                            <option value="">Select Item Being Returned</option>
                            {checkedOutLoan.map(item => <option key={item.id} value={item.asset_id} >
                                {item.asset_id} - {item.equipment_name}
                            </option>)}
                        </select>
                    </div>


                    {selectedLoan && (



                        <div className={styles.contextLoanCard}>
                            <h3 style={{ color: "#000" }}>Active Loan Details</h3>
                            <p style={{ color: " #15616d" }}> <strong>Borrowed By:</strong> {selectedLoan.borrower}</p>
                            <p style={{ color: "#2e7d32" }}> <strong>Checkedout At: </strong>{formatDate(selectedLoan.checkout_date)} at {selectedLoan.checkout_time}</p>
                            <p style={{ color: "#78290f" }}> <strong>Expected By:</strong> {selectedLoan.expected_return_time}</p>
                        </div>
                    )
                    }

                    <div className={styles.formGroup}>
                        <select name="condition_in" id="condition_in" value={returnData.condition_in} onChange={handleChange}>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Damaged">Damaged</option>


                        </select>
                    </div>

                    {returnData.condition_in === "Damaged" && (
                        <div className={styles.formGroup}>
                            <label htmlFor="damage_description">Damage Description</label>
                            <textarea
                                name="damage_description"
                                id="damage_description"
                                value={returnData.damage_description}
                                onChange={handleChange}
                                placeholder="Describe cracked parts, missing cables, power issues, etc."
                                required
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="remark">Staff Remark (Optional)</label>
                        <input type="text" onChange={handleChange} value={returnData.remarks} name='remarks' />

                    </div>


                    <button type='submit' className={styles.submitBtn} disabled={isSubmitting}> {isSubmitting ? "Processing Return..." : "Confirm Return & Update Status"} </button>
                </form>
            </div>

        </div>
    )
}

export default Return