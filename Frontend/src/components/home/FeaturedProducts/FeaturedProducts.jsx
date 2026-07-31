import { useEffect, useState } from "react";

import styles from "./FeaturedProducts.module.css";
import ProductCard from "../../ui/ProductCard/ProductCard";

import { getFeaturedProducts } from "../../../services/product.service";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await getFeaturedProducts();
      setProducts(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className={styles.featuredProducts}>
        <div className={styles.sectionHeader}>
          <h2>Featured Products</h2>
          <p>Discover our handpicked collection of top-selling products.</p>
        </div>

        <p>Loading featured products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.featuredProducts}>
        <div className={styles.sectionHeader}>
          <h2>Featured Products</h2>
          <p>Discover our handpicked collection of top-selling products.</p>
        </div>

        <p>Unable to load featured products. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className={styles.featuredProducts}>
      <div className={styles.sectionHeader}>
        <h2>Featured Products</h2>
        <p>Discover our handpicked collection of top-selling products.</p>
      </div>

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
