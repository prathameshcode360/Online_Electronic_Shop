import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createOrder } from "../../../features/order/orderSlice";
import { fetchCart } from "../../../features/cart/cartSlice";

import { createOrderSchema } from "../../../validations/order.validation";

import styles from "./CheckoutForm.module.css";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { isCreating } = useSelector((state) => state.order);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const { totalAmount, itemCount } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        totalAmount: acc.totalAmount + item.product.price * item.quantity,
        itemCount: acc.itemCount + item.quantity,
      }),
      {
        totalAmount: 0,
        itemCount: 0,
      },
    );
  }, [items]);

  const onSubmit = async (data) => {
    try {
      // Send the shipping address data directly, not nested
      await dispatch(createOrder(data)).unwrap();

      await dispatch(fetchCart()).unwrap();

      navigate("/orders");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.checkout}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2>Shipping Address</h2>

        <div className={styles.group}>
          <label>Full Name</label>
          <input {...register("fullName")} />
          <p>{errors.fullName?.message}</p>
        </div>

        <div className={styles.group}>
          <label>Phone</label>
          <input {...register("phone")} />
          <p>{errors.phone?.message}</p>
        </div>

        <div className={styles.group}>
          <label>Address Line 1</label>
          <input {...register("addressLine1")} />
          <p>{errors.addressLine1?.message}</p>
        </div>

        <div className={styles.group}>
          <label>Address Line 2</label>
          <input {...register("addressLine2")} />
          <p>{errors.addressLine2?.message}</p>
        </div>

        <div className={styles.group}>
          <label>City</label>
          <input {...register("city")} />
          <p>{errors.city?.message}</p>
        </div>

        <div className={styles.group}>
          <label>State</label>
          <input {...register("state")} />
          <p>{errors.state?.message}</p>
        </div>

        <div className={styles.group}>
          <label>Postal Code</label>
          <input {...register("postalCode")} />
          <p>{errors.postalCode?.message}</p>
        </div>

        <div className={styles.group}>
          <label>Country</label>
          <input {...register("country")} />
          <p>{errors.country?.message}</p>
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className={styles.submitBtn}>
          {isCreating ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <aside className={styles.summary}>
        <h2>Order Summary</h2>

        <p>
          <strong>Items:</strong> {itemCount}
        </p>

        <p>
          <strong>Total:</strong> ₹{totalAmount}
        </p>

        <hr />

        {items.map((item) => (
          <div key={item.product._id} className={styles.item}>
            <span>{item.product.name}</span>

            <span>
              {item.quantity} × ₹{item.product.price}
            </span>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default CheckoutForm;
