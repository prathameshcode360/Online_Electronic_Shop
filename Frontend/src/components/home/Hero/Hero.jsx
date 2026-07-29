import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.badge}>New Collection 2026</span>

        <h1 className={styles.title}>Discover the Latest Electronic Gadgets</h1>

        <p className={styles.description}>
          Upgrade your lifestyle with premium laptops, smartphones, accessories,
          and smart home devices at unbeatable prices.
        </p>

        <div className={styles.actions}>
          <Link to="/shop" className={styles.primaryButton}>
            Shop Now
          </Link>

          <Link to="/deals" className={styles.secondaryButton}>
            Explore Deals
          </Link>
        </div>
      </div>

      <div className={styles.heroImage}>
        <img
          src="/src/assets/images/hero-banner.png"
          alt="Electronic Gadgets"
        />
      </div>
    </section>
  );
};

export default Hero;
