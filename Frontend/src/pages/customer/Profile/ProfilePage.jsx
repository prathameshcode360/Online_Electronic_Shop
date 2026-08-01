import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";

import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // dispatch(logout());
    // navigate("/login");
  };

  return (
    <section className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>Profile</h1>

        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <img
              src={
                user?.profileImage ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user?.name || "User") +
                  "&background=FFC107&color=1E293B&size=128"
              }
              alt={user?.name || "User"}
              className={styles.avatar}
            />
          </div>

          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user?.name || "Guest User"}</h2>
            <p className={styles.userEmail}>
              {user?.email || "guest@example.com"}
            </p>
            {user?.role && <span className={styles.userRole}>{user.role}</span>}
          </div>
        </div>

        <div className={styles.menu}>
          <div
            className={styles.menuCard}
            onClick={() => navigate("/orders")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate("/orders");
              }
            }}>
            <div className={styles.menuLeft}>
              <div className={`${styles.menuIcon} ${styles.ordersIcon}`}>
                <FaBoxOpen />
              </div>

              <div className={styles.menuContent}>
                <h3 className={styles.menuTitle}>Your Orders</h3>
                <span className={styles.menuDescription}>
                  View and track your orders
                </span>
              </div>
            </div>

            <FaChevronRight className={styles.menuArrow} />
          </div>

          <div
            className={styles.menuCard}
            onClick={() => navigate("/profile/details")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate("/profile/details");
              }
            }}>
            <div className={styles.menuLeft}>
              <div className={`${styles.menuIcon} ${styles.detailsIcon}`}>
                <FaUserCircle />
              </div>

              <div className={styles.menuContent}>
                <h3 className={styles.menuTitle}>Account Details</h3>
                <span className={styles.menuDescription}>
                  View and edit your details
                </span>
              </div>
            </div>

            <FaChevronRight className={styles.menuArrow} />
          </div>

          <div
            className={`${styles.menuCard} ${styles.logoutCard}`}
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleLogout();
              }
            }}>
            <div className={styles.menuLeft}>
              <div className={`${styles.menuIcon} ${styles.logoutIcon}`}>
                <FaSignOutAlt />
              </div>

              <div className={styles.menuContent}>
                <h3 className={styles.menuTitle}>Logout</h3>
                <span className={styles.menuDescription}>
                  Sign out of your account
                </span>
              </div>
            </div>

            <FaChevronRight className={styles.menuArrow} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
