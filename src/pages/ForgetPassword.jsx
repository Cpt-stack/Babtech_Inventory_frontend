import React , {useEffect , useState}from 'react'
import styles from "./css/Auth.module.css"
import Logo from "../assets/Babtech.png"
import {Link} from "react-router-dom"


function ForgetPassword() {
    const [email , setEmail] = useState("");
    const [error , setError] = useState("")
    const [success , setSuccess] = useState("")

    const [loading ,setLoader] = useState(false)

    function handleChange(e){
        const {value} = e.target;
        setEmail(value);
    }

    function handleSubmit(e){
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoader(true)


        if(!email || !email.trim()){
            setError("Please Enter an Email")
        }


    }
  return (
    
        <div className={styles.authContainer}>

{/* 
            <div className={styles.authContainerImage}>
                <img src={svg} alt="Display Image" />

            </div> */}

            <div className={styles.authCardContainer}>

                <div className={styles.authCard}>

                    <div className={styles.authCardLogo}>
                        <span className={styles.Imgspan}> <img src={Logo} alt="Babtech Logo" /></span>
                    </div>

                    <h2>Babtech HardWare Inventory</h2>
                    <p className={styles.subtitle}>Enter Your Email</p>

{/* 
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {success && <div className={styles.successMessage}>{success}</div>} */}

                    <form action="" onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" required name='email' value={email} onChange={handleChange} placeholder='e.g user@gmail.com' />
                        </div>


                        <button type='submit' className={styles.submitBtn} disabled={loading}>{loading ? "Sent..." : "Send Link"}</button>


                        <p className={styles.authFooter}>Dont have an account? <Link to="/register">Register here</Link></p>
                        <p className={styles.authFooter}>Made By : Israel Brian 240591398</p>
                    </form>
                </div>
            </div>

        </div>

  )
}

export default ForgetPassword