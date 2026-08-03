import { useNavigate } from "react-router-dom";

import styles from "./CartSummary.module.css";

const CartSummary = ({ totalAmount, itemCount, loading, onClearCart }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className={styles.summary}>
      <div className={styles.summaryDetails}>
        <div className={styles.totalSection}>
          <span className={styles.label}>Total Items:</span>
          <span className={styles.value}>{itemCount}</span>
        </div>

        <div className={styles.totalSection}>
          <span className={styles.label}>Grand Total:</span>
          <span className={styles.totalAmount}>
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={onClearCart}
          disabled={loading || itemCount === 0}
          className={`${styles.clearBtn} ${loading ? styles.loading : ""}`}>
          {loading ? "Processing..." : "Clear Cart"}
        </button>

        <button
          onClick={handleCheckout}
          disabled={loading || itemCount === 0}
          className={styles.checkoutBtn}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
