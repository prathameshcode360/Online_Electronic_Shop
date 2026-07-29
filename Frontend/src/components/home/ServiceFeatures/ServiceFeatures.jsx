import styles from "./ServiceFeatures.module.css";

// Dummy Icons
import shippingIcon from "../../../assets/icons/free-shipping.png";
import returnIcon from "../../../assets/icons/easy-return.png";
import warrantyIcon from "../../../assets/icons/warranty.png";
import supportIcon from "../../../assets/icons/customer-support.png";

const ServiceFeatures = () => {
  const services = [
    {
      id: 1,
      title: "Free Shipping",
      description: "Free shipping on all orders over ₹999.",
      icon: shippingIcon,
    },
    {
      id: 2,
      title: "Easy Returns",
      description: "7-day hassle-free return policy.",
      icon: returnIcon,
    },
    {
      id: 3,
      title: "Warranty",
      description: "100% genuine products with official warranty.",
      icon: warrantyIcon,
    },
    {
      id: 4,
      title: "24/7 Support",
      description: "Our support team is always ready to help.",
      icon: supportIcon,
    },
  ];

  return (
    <section className={styles.serviceFeatures}>
      <div className={styles.sectionHeader}>
        <h2>Why Shop With Us?</h2>
        <p>We provide the best shopping experience for our customers.</p>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <article key={service.id} className={styles.serviceCard}>
            <img
              src={service.icon}
              alt={service.title}
              className={styles.serviceIcon}
            />

            <h3 className={styles.serviceTitle}>{service.title}</h3>

            <p className={styles.serviceDescription}>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ServiceFeatures;
