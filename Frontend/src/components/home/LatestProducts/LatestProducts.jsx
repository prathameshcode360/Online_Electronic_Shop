import styles from "./LatestProducts.module.css";
import ProductCard from "../../ui/ProductCard/ProductCard";

// Dummy Images
import tabletImage from "../../../assets/images/products/tablet.jpg";
import speakerImage from "../../../assets/images/products/speaker.jpg";
import earbudsImage from "../../../assets/images/products/earbuds.jpg";
import monitorImage from "../../../assets/images/products/monitor.jpg";

const LatestProducts = () => {
  // Temporary static data
  const latestProducts = [
    {
      _id: 5,
      name: "Android Tablet",
      image: tabletImage,
      price: 39999,
      discountPrice: 34999,
      rating: 4.5,
    },
    {
      _id: 6,
      name: "Bluetooth Speaker",
      image: speakerImage,
      price: 9999,
      discountPrice: 7999,
      rating: 4.6,
    },
    {
      _id: 7,
      name: "Wireless Earbuds",
      image: earbudsImage,
      price: 7999,
      discountPrice: 6499,
      rating: 4.7,
    },
    {
      _id: 8,
      name: "4K LED Monitor",
      image: monitorImage,
      price: 24999,
      discountPrice: 21999,
      rating: 4.8,
    },
  ];

  return (
    <section className={styles.latestProducts}>
      <div className={styles.sectionHeader}>
        <h2>Latest Products</h2>
        <p>Explore the newest arrivals in our electronics collection.</p>
      </div>

      <div className={styles.productsGrid}>
        {latestProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
