import React, { useEffect, useState } from 'react';
import styles from "./css/Equipment.module.css";
import { isAdmin, isTechnician } from '../utils/auth';
import API from "../services/api.js"
import { MutatingDots } from "react-loader-spinner"



function Equipment() {


  const initialFormState = {
    asset_id: "",
    name: "",
    category: "Laptop",
    condition: "Good",
    status: "Available"
  };

  const Admin = isTechnician() || isAdmin();

  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [searchItem, setSearchItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [formError, setFormError] = useState("")
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoader(true);

        const response = await API.get("/equipment/get");
        // console.log(response.data.data)

        setEquipment(response.data.data || [])

      }
      catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch equipment')
      }
      finally {
        setLoader(false)
      }
    }

    fetchEquipment()
  }, [])





  if (loader) return <div className={styles.loader}>
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
  if (error) return <p className="modalError">{error}</p>






  function handleSearch(e) {
    setSearchItem(e.target.value);
  }

  function handleCategory(e) {
    setSelectedCategory(e.target.value);
  }

  function handleAdd() {
    setIsModalOpen(true);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setFormError("")

    if (!formData.asset_id.trim() || !formData.name.trim()) {

      setFormError("Asset ID and Item Name are required.");
      return;
    };

    try {

      const response = await API.post("/equipment/Add", {
        asset_id: formData.asset_id.trim(),
        name: formData.name,
        category: formData.category,
        condition: formData.condition,
        status: formData.status
      })
      console.log(response.data.data)


      setEquipment((prev) => [...prev, response.data.data]);
      setFormData(initialFormState);
      setIsModalOpen(false);

    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save equipment');
    }
  }

  async function handleDelete(asset_id) {
    try {
      const response = await API.delete(`/equipment/delete/${asset_id}`);
      setEquipment((prev) => prev.filter((item) => item.asset_id !== asset_id))


    } catch (error) {
      console.log("Delete failed:", error.response?.data?.error || error.message)
    }

  }

  const filteredEquipment = equipment.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const itemName = item.name || "";
    const itemAssetId = item.asset_id || "";

    const matchesSearch =
      itemName.toLowerCase().includes(searchItem.toLowerCase()) ||
      itemAssetId.toLowerCase().includes(searchItem.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loader) return <p>Loading inventory....</p>;
  if (error) return <p>{error}</p>;

  const items = ["All", "Laptop", "Desktop", "Projector", "Monitor",
    "Camera", "Speaker", "Cable", "USB Storage", "USB Hub", "Storage Device",
    "Keyword", "Mouse", "Power BackUp", "Networking", "Printer",
    "Audio Equipment", "Camera Accessories"]


  return (
    <div className={styles.equipmentContainer}>
      <header>
        <h1>Babtech Computers Equipment</h1>
        <p>Search and manage all equipment available in the inventory.</p>

        <div className={styles.controlsBar}>
          <div className={styles.controlsBarInput}>
            <input
              type="text"
              placeholder="Search by Asset ID or Name"
              aria-label="Search by Asset ID or Name"
              value={searchItem}
              onChange={handleSearch}
            />
          </div>

          <div className={styles.controlsBarDropdown}>
            <select
              name="category"
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={handleCategory}
            >
        
              {items.map(item => {
                return <option key={item} value={item}>{item}</option>
              })}
            </select>
          </div>

          {Admin && (<button className={styles.addBtn} onClick={handleAdd}>
            + Add Equipment
          </button>)}
        </div>


      </header>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Asset ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Condition</th>
            <th>Status</th>
            {Admin && (

              <th>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredEquipment.length > 0 ? (
            filteredEquipment.map((item) => (
              <tr key={item.id}>
                <td>{item.asset_id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.condition}</td>
                <td>{item.status}</td>
                <td>
                  {Admin && (

                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item.asset_id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1.5rem" }}>
                No equipment found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Conditionally rendered modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>

          <div className={styles.modalCard}>

            <h3>Register New Equipment</h3>

            <form onSubmit={handleFormSubmit}>

              <div className={styles.formGroup}>
                <label htmlFor="assetID">Asset ID:</label>
                <input type="text" name="asset_id" id="assetID" value={formData.asset_id} onChange={handleInputChange} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Item Name:</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category:</label>
                <select name="category" id="category" value={formData.category} onChange={handleInputChange}>
            
                  {items.map(item => {
                    return <option key={item} value={item}>{item}</option>
                  })}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="condition">Condition:</label>
                <select
                  name="condition"
                  id="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Bad">Bad</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.addBtn}>
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Equipment;
