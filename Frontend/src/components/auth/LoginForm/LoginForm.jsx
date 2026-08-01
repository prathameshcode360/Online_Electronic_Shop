import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "../../../features/auth/authSlice";
import { loginSchema } from "../../../validations/auth.validation";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>
          Email
        </label>

        <input
          id="email"
          type="email"
          className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
          {...register("email")}
          placeholder="Enter your email"
        />

        {errors.email && (
          <p className={styles.errorMessage}>{errors.email.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.formLabel}>
          Password
        </label>

        <input
          id="password"
          type="password"
          className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
          {...register("password")}
          placeholder="Enter your password"
        />

        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className={styles.formError}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      <button
        type="submit"
        className={`${styles.submitButton} ${loading ? styles.buttonLoading : ""}`}
        disabled={loading}>
        {loading ? (
          <>
            <span className={styles.loadingSpinner}></span>
            Logging In...
          </>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
