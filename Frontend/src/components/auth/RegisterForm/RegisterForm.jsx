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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>

        <input id="name" type="text" {...register("name")} />

        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>

        <input id="email" type="email" {...register("email")} />

        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>

        <input id="password" type="password" {...register("password")} />

        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>

        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
