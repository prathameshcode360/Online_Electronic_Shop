import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchOrderById } from "../../../features/order/orderSlice";

import styles from "./OrderDetailsPage.module.css";

const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const { currentOrder, isFetchingOrder, error } = useSelector(
    (state) => state.order,
  );

  useEffect(() => {
    // Fetch order when component mounts or orderId changes
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  if (isFetchingOrder) {
    return (
      <section className={styles.orderDetails}>
        <div className={styles.container}>
          <h1>Order Details</h1>
          <p>Loading order...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.orderDetails}>
        <div className={styles.container}>
          <h1>Order Details</h1>
          <p className={styles.error}>{error}</p>
        </div>
      </section>
    );
  }

  if (!currentOrder) {
    return (
      <section className={styles.orderDetails}>
        <div className={styles.container}>
          <h1>Order Details</h1>
          <p>Order not found.</p>
        </div>
      </section>
    );
  }

  const {
    _id,
    createdAt,
    totalAmount,
    orderStatus,
    paymentStatus,
    shippingAddress,
    items,
  } = currentOrder;

  return (
    <section className={styles.orderDetails}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Order Details</h1>

        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <h2>Order #{_id.slice(-8).toUpperCase()}</h2>
              <p>{new Date(createdAt).toLocaleString()}</p>
            </div>

            <div className={styles.total}>
              ₹{totalAmount.toLocaleString("en-IN")}
            </div>
          </div>

          <div className={styles.statusContainer}>
            <div>
              <strong>Order Status</strong>
              <p>{orderStatus}</p>
            </div>

            <div>
              <strong>Payment Status</strong>
              <p>{paymentStatus}</p>
            </div>
          </div>

          <hr />

          <div className={styles.address}>
            <h3>Shipping Address</h3>

            <p>{shippingAddress.fullName}</p>
            <p>{shippingAddress.phone}</p>
            <p>{shippingAddress.addressLine1}</p>

            {shippingAddress.addressLine2 && (
              <p>{shippingAddress.addressLine2}</p>
            )}

            <p>
              {shippingAddress.city}, {shippingAddress.state}
            </p>

            <p>
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <hr />

          <div className={styles.items}>
            <h3>Ordered Items</h3>

            {items.map((item) => (
              <div key={item.product._id} className={styles.item}>
                <img
                  src={item.product.images?.[0]?.url}
                  alt={item.product.name}
                  className={styles.image}
                />

                <div className={styles.itemInfo}>
                  <h4>{item.product.name}</h4>

                  <p>
                    Quantity: <strong>{item.quantity}</strong>
                  </p>

                  <p>
                    Price: <strong>₹{item.price}</strong>
                  </p>
                </div>

                <div className={styles.itemTotal}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          <hr />

          <div className={styles.footer}>
            <h2>Total: ₹{totalAmount.toLocaleString("en-IN")}</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetailsPage;
