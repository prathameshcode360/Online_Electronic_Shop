import { Link } from "react-router-dom";

import styles from "./OrderCard.module.css";

const OrderCard = ({ order }) => {
  const { _id, createdAt, totalAmount, orderStatus, paymentStatus, items } =
    order;

  const orderDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className={styles.orderCard}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.orderId}>
            Order #{_id.slice(-8).toUpperCase()}
          </h3>

          <p className={styles.date}>{orderDate}</p>
        </div>

        <div className={styles.total}>
          ₹{totalAmount.toLocaleString("en-IN")}
        </div>
      </div>

      <div className={styles.info}>
        <div>
          <span className={styles.label}>Items</span>
          <p>{items.length}</p>
        </div>

        <div>
          <span className={styles.label}>Order Status</span>
          <p className={`${styles.status} ${styles[orderStatus]}`}>
            {orderStatus}
          </p>
        </div>

        <div>
          <span className={styles.label}>Payment</span>
          <p className={`${styles.status} ${styles[paymentStatus]}`}>
            {paymentStatus}
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <Link to={`/orders/${_id}`} className={styles.viewBtn}>
          View Details →
        </Link>
      </div>
    </article>
  );
};

export default OrderCard;
