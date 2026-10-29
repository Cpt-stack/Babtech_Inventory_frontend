import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faGauge, faComputer, faArrowRightFromBracket, faArrowRightToBracket, faClockRotateLeft, faRightFromBracket, faAnglesLeft, faAnglesRight, faUser, faGear } from "@fortawesome/free-solid-svg-icons";

import { getCurrentUser, isAdmin, isTechnician, logout } from "../utils/auth";

import styles from "./css/Sidebar.module.css";


function Sidebar({ isSidebarOpen, closeSidebar }) {

    const [isExpanded, setIsExpanded] = useState(true);

    const user = getCurrentUser();

    const userIsAdmin = isAdmin();
    const userIsTechnician = isTechnician();

    const canManageEquipment = userIsAdmin || userIsTechnician;

    const fullName = user?.full_name || "Guest User";

    const initials = fullName.split(/\s+/).filter(Boolean).map((namePart)=> namePart.charAt(0)
    ).slice(0, 2).join("").toUpperCase();

    // Navigation configuration
    const navigationItems = [
        {
            label: "Dashboard",
            path: "/",
            icon: faGauge,
            end: true
        },
        {
            label: "Equipment",
            path: "/equipment",
            icon: faComputer
        },
        {
            label: "Checkout",
            path: "/checkout",
            icon: faArrowRightFromBracket,
            requiresManagementAccess: true
        },
        {
            label: "Return",
            path: "/return",
            icon: faArrowRightToBracket,
            requiresManagementAccess: true
        },
        {
            label: "History",
            path: "/history",
            icon: faClockRotateLeft,
            requiresManagementAccess: true
        },

        {
            label: "Admin Settings",
            path: "/admin",
            icon: faGear,
            requiresAdminAccess: true
        }
    ];


    const visibleNavigationItems = navigationItems.filter(item => {
        if (item.requiresAdminAccess && !userIsAdmin) {
            return false;
        }
        if (item.requiresManagementAccess && !canManageEquipment) {
            return false;
        }
        return true;
    });


    function toggleSidebarWidth() {
        setIsExpanded(prev => !prev)
    }


    // Close the mobile sidebar after a navigation link is clicked.
    function handleNavigation() {
        if (closeSidebar) {
            closeSidebar();
        }
    }


    // Build the sidebar's CSS classes.
    const sidebarClasses = [
        styles.sidebar,
        isExpanded ? styles.expanded : styles.collapsed,
        isSidebarOpen ? styles.mobileOpen : ""
    ].filter(Boolean).join(" ");


    return (
        <aside className={sidebarClasses}>

            {/* BRAND */}
            <div className={styles.brandArea}>

                <Link to="/" className={styles.brandLogo} aria-label="Babtech Computers dashboard" onClick={handleNavigation}>
                    <img
                        src="https://pbs.twimg.com/profile_images/1399841217593196551/rHORHepN_400x400.jpg"
                        alt="Babtech Computers"
                    />

                    <span className={styles.brandText}>
                        <strong>Babtech</strong>
                        <strong>Computers</strong>
                    </span>
                </Link>

                <button type="button" className={styles.collapseButton} onClick={toggleSidebarWidth}
                    aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    aria-expanded={isExpanded}
                    title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}>
                    <FontAwesomeIcon
                        icon={isExpanded ? faAnglesLeft : faAnglesRight}
                    />
                </button>

            </div>


            {/* NAVIGATION */}
            <nav
                className={styles.sidebarNav}
                aria-label="Main navigation"
            >

                <p className={styles.sectionLabel}>
                    MENU
                </p>

                <ul>
                    {visibleNavigationItems.map(function (item) {

                        return (
                            <li key={item.path} className={styles.navItem} data-tooltip={item.label}>

                                <NavLink to={item.path} end={item.end} onClick={handleNavigation}
                                    className={function ({ isActive }) { return [styles.navLink, isActive ? styles.activeLink : ""].filter(Boolean).join(" ") }}
                                    aria-label={item.label}
                                    title={!isExpanded ? item.label : undefined} >

                                    <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />

                                    <span className={styles.navText}> {item.label}</span>
                                </NavLink>

                            </li>
                        );

                    })}
                </ul>

            </nav>


            {/* USER PROFILE */}
            <div className={styles.profileSection}>

                {user ? (

                    <div className={styles.profileCard}>

                        <div className={styles.avatar}>
                            {initials || (
                                <FontAwesomeIcon icon={faUser} />
                            )}
                        </div>

                        <div className={styles.profileDetails}>

                            <span className={styles.username}>
                                {fullName}
                            </span>

                            <span
                                className={[
                                    styles.roleBadge,
                                    userIsAdmin
                                        ? styles.adminBadge
                                        : userIsTechnician
                                            ? styles.technicianBadge
                                            : styles.viewerBadge
                                ].join(" ")}
                            >
                                {user.role || "Viewer"}
                            </span>

                        </div>

                        <button type="button" className={styles.logoutButton} onClick={logout} title="Log out" aria-label="Log out">
                            <FontAwesomeIcon
                                icon={faRightFromBracket} />
                        </button>

                    </div>

                ) : (

                    <Link to="/login" className={styles.loginLink} onClick={handleNavigation}><FontAwesomeIcon icon={faUser} />
                        <span>Sign in</span>
                    </Link>

                )}

            </div>

        </aside>
    );
}

export default Sidebar;