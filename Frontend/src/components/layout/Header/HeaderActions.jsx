import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "../Header/Header.module.css";

const HeaderActions = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
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

      <button type="button" className={styles.actionButton}>
        Cart
      </button>
    </div>
  );
};

export default HeaderActions;
