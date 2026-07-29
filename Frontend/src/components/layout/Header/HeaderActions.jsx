import styles from "../Header/Header.module.css";

const HeaderActions = () => {
  return (
    <div className={styles.headerActions}>
      <button type="button" className={styles.actionButton}>
        Account
      </button>

      <button type="button" className={styles.actionButton}>
        Wishlist
      </button>

      <button type="button" className={styles.actionButton}>
        Cart
      </button>
    </div>
  );
};

export default HeaderActions;
