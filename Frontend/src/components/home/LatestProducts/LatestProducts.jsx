import { useEffect, useState } from "react";

import styles from "./LatestProducts.module.css";
import ProductCard from "../../ui/ProductCard/ProductCard";

import { getLatestProducts } from "../../../services/product.service";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestProducts = async () => {
    try {
      const data = await getLatestProducts();
      setProducts(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  if (loading) {
    return (
      <section className={styles.latestProducts}>
        <div className={styles.sectionHeader}>
          <h2>Latest Products</h2>
          <p>Explore the newest arrivals in our electronics collection.</p>
        </div>

        <p>Loading latest products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.latestProducts}>
        <div className={styles.sectionHeader}>
          <h2>Latest Products</h2>
          <p>Explore the newest arrivals in our electronics collection.</p>
        </div>

        <p>Unable to load latest products. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className={styles.latestProducts}>
      <div className={styles.sectionHeader}>
        <h2>Latest Products</h2>
        <p>Explore the newest arrivals in our electronics collection.</p>
      </div>

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
