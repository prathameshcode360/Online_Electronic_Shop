import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  register as registerUser,
  resetRegisterSuccess,
} from "../../../features/auth/authSlice";
import { registerSchema } from "../../../validations/auth.validation";
import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (registerSuccess) {
      navigate("/login");
      dispatch(resetRegisterSuccess());
    }
  }, [registerSuccess, navigate, dispatch]);

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.formLabel}>
          Full Name
        </label>

        <input
          id="name"
          type="text"
          className={`${styles.formInput} ${errors.name ? styles.inputError : ""}`}
          {...register("name")}
          placeholder="Enter your full name"
        />

        {errors.name && (
          <p className={styles.errorMessage}>{errors.name.message}</p>
        )}
      </div>

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
          placeholder="Create a password"
        />

        {errors.password && (
          <p className={styles.errorMessage}>{errors.password.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.formLabel}>
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ""}`}
          {...register("confirmPassword")}
          placeholder="Confirm your password"
        />

        {errors.confirmPassword && (
          <p className={styles.errorMessage}>
            {errors.confirmPassword.message}
          </p>
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
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
