import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./FeaturedProducts.module.css";
import ProductCard from "../../ui/ProductCard/ProductCard";

import { fetchFeaturedProducts } from "../../../features/products/productSlice";

const FeaturedProducts = () => {
  const dispatch = useDispatch();

  const { featuredProducts, featuredLoading, featuredError, featuredFetched } =
    useSelector((state) => state.products);

  useEffect(() => {
    // ✅ Only fetch if featured products haven't been fetched yet
    if (!featuredFetched) {
      dispatch(fetchFeaturedProducts());
    }
  }, [dispatch, featuredFetched]);

  if (featuredLoading) {
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

  if (featuredError) {
    return (
      <section className={styles.featuredProducts}>
        <div className={styles.sectionHeader}>
          <h2>Featured Products</h2>
          <p>Discover our handpicked collection of top-selling products.</p>
        </div>

        <p>{featuredError}</p>
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
        {featuredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
