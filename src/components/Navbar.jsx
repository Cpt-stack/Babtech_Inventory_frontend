import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./css/Navbar.module.css";

function Navbar({ isSidebarOpen, toggleSidebar }) {
  return (
    <header className={styles.navbar}>

      <div className={styles.pageTitle}>
        <h1>Hardware Inventory System</h1>
      </div>

      <button  type="button" className={styles.hamburger} onClick={toggleSidebar} aria-label={isSidebarOpen ? "Close menu" : "Open menu"} aria-expanded={isSidebarOpen}>
        
        <FontAwesomeIcon
          icon={isSidebarOpen ? faXmark : faBars} />
      </button>
    </header >
);

}

export default Navbar;