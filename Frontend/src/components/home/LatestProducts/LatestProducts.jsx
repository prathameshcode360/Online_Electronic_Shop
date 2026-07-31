import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./LatestProducts.module.css";
import ProductCard from "../../ui/ProductCard/ProductCard";

import { fetchLatestProducts } from "../../../features/products/productSlice";

const LatestProducts = () => {
  const dispatch = useDispatch();

  const { latestProducts, latestLoading, latestError, latestFetched } =
    useSelector((state) => state.products);

  useEffect(() => {
    // ✅ Only fetch if latest products haven't been fetched yet
    if (!latestFetched) {
      dispatch(fetchLatestProducts());
    }
  }, [dispatch, latestFetched]);

  if (latestLoading) {
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

  if (latestError) {
    return (
      <section className={styles.latestProducts}>
        <div className={styles.sectionHeader}>
          <h2>Latest Products</h2>
          <p>Explore the newest arrivals in our electronics collection.</p>
        </div>

        <p>{latestError}</p>
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
        {latestProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
