import { Link } from "react-router-dom";
import LoginForm from "../../../components/auth/LoginForm/LoginForm";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <section className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue shopping.</p>
        </div>

        <LoginForm />

        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.registerLink}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
