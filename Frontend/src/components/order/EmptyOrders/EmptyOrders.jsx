import { Link } from "react-router-dom";

import styles from "./EmptyOrders.module.css";

const EmptyOrders = () => {
  return (
    <section className={styles.emptyOrders}>
      <div className={styles.content}>
        <div className={styles.icon}>📦</div>

        <h2 className={styles.title}>No Orders Yet</h2>

        <p className={styles.message}>
          You haven't placed any orders yet. Browse our products and place your
          first order today.
        </p>

        <Link to="/" className={styles.shopBtn}>
          Start Shopping →
        </Link>
      </div>
    </section>
  );
};

export default EmptyOrders;
