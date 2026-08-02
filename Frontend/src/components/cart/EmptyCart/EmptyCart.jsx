import { Link } from "react-router-dom";
import styles from "./EmptyCart.module.css";

const EmptyCart = () => {
  return (
    <section className={styles.emptyCart}>
      <div className={styles.content}>
        <div className={styles.icon}>🛒</div>
        <h2 className={styles.title}>Your Cart is Empty</h2>
        <p className={styles.message}>
          Looks like you haven't added any items to your cart yet. Start
          exploring our products and find something you'll love!
        </p>
        <Link to="/" className={styles.shopBtn}>
          Continue Shopping →
        </Link>
      </div>
    </section>
  );
};

export default EmptyCart;
