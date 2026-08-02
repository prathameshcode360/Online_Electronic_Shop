import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "../Header/Header.module.css";

const HeaderActions = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  // Total quantity of all cart items
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.headerActions}>
      <button
        type="button"
        className={styles.actionButton}
        onClick={handleAccountClick}>
        Account
      </button>

      <button type="button" className={styles.actionButton}>
        Wishlist
      </button>

      <button
        type="button"
        className={styles.actionButton}
        onClick={handleCartClick}>
        Cart {cartCount > 0 && `(${cartCount})`}
      </button>
    </div>
  );
};

export default HeaderActions;
