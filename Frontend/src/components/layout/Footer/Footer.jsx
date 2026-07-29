import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Brand Section */}
        <div className={styles.footerSection}>
          <h2>ElectroHub</h2>
          <p>
            Your one-stop destination for the latest electronic gadgets and
            accessories.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/shop">Shop</NavLink>
            </li>
            <li>
              <NavLink to="/deals">Deals</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className={styles.footerSection}>
          <h3>Customer Support</h3>
          <ul>
            <li>Shipping Policy</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.footerSection}>
          <h3>Contact Us</h3>
          <p>Email: support@electrohub.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Kolhapur, Maharashtra, India</p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} ElectroHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
