import { Link } from "react-router-dom";
import RegisterForm from "../../../components/auth/RegisterForm/RegisterForm";
import styles from "./Register.module.css";

const Register = () => {
  return (
    <section className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerHeader}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Create your account to start shopping.
          </p>
        </div>

        <RegisterForm />

        <div className={styles.registerFooter}>
          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLink}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
