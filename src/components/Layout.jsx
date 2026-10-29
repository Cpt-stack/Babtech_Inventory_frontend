// import React from 'react'
// import Sidebar from './Sidebar'
// import { Outlet } from "react-router-dom"
// import Navbar from './Navbar'
// import styles from "./css/Layout.module.css"

// function Layout() {
//     return (
//         <div className={styles.appLayout}>
//             <Sidebar className={styles.sideBar} />

//             <div className={styles.mainSection}>
//                 <Navbar />

//                 <main className={styles.contentArea}>
//                     <Outlet/>
//                 </main>

//             </div>
//         </div>
//     )
// }

// export default Layout


import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import styles from "./css/Layout.module.css";


function Layout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    function toggleSidebar() {
        setIsSidebarOpen(function (previousState) {
            return !previousState;
        });
    }


    function closeSidebar() {
        setIsSidebarOpen(false);
    }


    // Close the mobile sidebar when switching to desktop.
    useEffect(function () {

        function handleResize() {
            if (window.innerWidth > 768) {
                setIsSidebarOpen(false);
            }
        }

        window.addEventListener("resize", handleResize);

        return function () {
            window.removeEventListener("resize", handleResize);
        };

    }, []);


    return (
        <div className={styles.appLayout}>

            <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar}/>


            {isSidebarOpen && (
                <button
                    type="button"
                    className={styles.sidebarOverlay}
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                />
            )}


            <div className={styles.mainArea}>

                <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

                <main className={styles.pageContent}>
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default Layout;