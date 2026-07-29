import styles from "./Newsletter.module.css";

const Newsletter = () => {
  return (
    <section className={styles.newsletter}>
      <div className={styles.newsletterContent}>
        <h2 className={styles.title}>Subscribe to Our Newsletter</h2>

        <p className={styles.description}>
          Stay updated with our latest products, exclusive offers, and special
          discounts delivered straight to your inbox.
        </p>

        <form className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Enter your email address"
            className={styles.emailInput}
          />

          <button type="submit" className={styles.subscribeButton}>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
