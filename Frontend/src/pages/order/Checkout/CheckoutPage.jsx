import CheckoutForm from "../../../components/order/CheckoutForm/CheckoutForm";

import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  return (
    <section className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Checkout</h1>

        <CheckoutForm />
      </div>
    </section>
  );
};

export default CheckoutPage;
