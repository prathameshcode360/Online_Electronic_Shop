import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/" className={styles.navLink}>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/shop" className={styles.navLink}>
            Shop
          </NavLink>
        </li>

        <li>
          <NavLink to="/deals" className={styles.navLink}>
            Deals
          </NavLink>
        </li>

        <li>
          <NavLink to="/new-arrivals" className={styles.navLink}>
            New Arrivals
          </NavLink>
        </li>

        <li>
          <NavLink to="/brands" className={styles.navLink}>
            Brands
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact" className={styles.navLink}>
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
