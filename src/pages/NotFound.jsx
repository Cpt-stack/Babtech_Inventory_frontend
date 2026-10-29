import errorImage from "../assets/404-error.svg";
import styles from "./css/NotFound.module.css"

function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>

            <img className={styles.errorImage}  src={errorImage}alt="404 Error Page Illustration" />

            <p>The page you are looking for does not exist.</p>
        </div>
    );
}

export default NotFound;