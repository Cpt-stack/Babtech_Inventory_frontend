import React, { useEffect, useState } from 'react'
import styles from "./css/History.module.css"
import API from "../services/api.js"

function History() {


  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [conditionalFilter, setConditionalFilter] = useState("All");
  const [error, setError] = useState("");


  useEffect(() => {
    async function getTransacions() {
      try {
        const response = await API.get("/transactions")
        setHistoryData(response.data.data)
      } catch (error) {
        setError(error.message)
      }
    }

    getTransacions()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return dateString.split("T")[0];
  };


  // filter logic
  const filteredHistory = historyData.filter((item) => {

    const term = searchTerm.toLowerCase();

    const matchesSearch = item.asset_id.toLowerCase().includes(term)
      || item.equipment_name.toLowerCase().includes(term) ||
      item.borrower.toLowerCase().includes(term)


    const statusFilterLogic = statusFilter === "All" || item.status === statusFilter



    const conditionalFilterLogic = conditionalFilter === "All" || item.condition_in === conditionalFilter || item.condition_out === conditionalFilter


    return matchesSearch && conditionalFilterLogic && statusFilterLogic;
  })

  function handleChange(e) {
    const { value } = e.target;
    setSearchTerm(value)
  }

  function handleConditionalfIltering(e) {
    setConditionalFilter(e.target.value)
  }

  function handleStatusFiltering(e) {
    setStatusFilter(e.target.value)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("")
    }, 2000)

    return () => {
      clearTimeout(timer)
    }

  }, [error])

  return (
    <div className={styles.historyContainer}>
      <header className={styles.header}>
        <h1 >Transaction History & Audit Logs</h1>
        <p>Tracks all past returns and ongoing equipment movements across labs</p>
      </header>


      <div className={styles.controlsBar}>

        <div className={styles.searchWrapper}>
          <input type="text" value={searchTerm} name='text' onChange={handleChange} placeholder='Enter a Name , AssetId or equipment' />
        </div>

        <div className={styles.filterGroup}>

          <select name="status" id="status" className={styles.filterSelect} value={statusFilter} onChange={handleStatusFiltering}>
            <option value="All"> All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>


          <select name="condition" id="condition" onChange={handleConditionalfIltering} value={conditionalFilter}>

            <option value="All">All Conditions</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Damaged">Damaged</option>

          </select>
        </div>

      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Asset& Name</th>
              <th>Borrower</th>
              <th>CheckOut Time</th>
              <th>Return Time</th>
              <th>Condition(Out - In)</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.emptyRow}>
                  No transaction records found.
                </td>
              </tr>
            ) : (filteredHistory.map(item => <tr key={item.id}>
              <td>
                <strong>{item.asset_id}</strong>
                <span className={styles.subtext}>{item.equipment_name}</span>
              </td>

              <td>{item.borrower}</td>

              <td>{formatDate(item.checkout_date)}
                <span className={styles.subtext}>{item.checkout_time}</span>
              </td>


              <td>
                {item.return_time ? (
                  <span> {formatDate(item.return_date)}
                    <span className={styles.subtext}> {item.return_time}</span>
                  </span>
                ) : (
                  <spam className={styles.activeIndicator}>Still in use</spam>
                )}
              </td>

              <td>
                {item.condition_out} →{" "}
                <span
                  className={item.conditionIn === "Damaged" ? styles.textDamaged : ""}>
                  {item.condition_in}
                </span>
              </td>

              <td>
                <span
                  className={`${styles.badge} ${item.status === "Active" ? styles.badgeActive : styles.badgeCompleted}`} >
                  {item.status}
                </span>
              </td>


              <td className={styles.remarksCell}>
                {item.remarks}
              </td>

            </tr>))}
          </tbody>


        </table>
      </div>

    </div>
  )
}

export default History

