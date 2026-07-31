import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CategoryCard from "./CategoryCard";
import styles from "./Categories.module.css";

import { fetchCategories } from "../../../features/categories/categorySlice";

const Categories = () => {
  const dispatch = useDispatch();

  const { categories, loading, error, fetched } = useSelector(
    (state) => state.categories,
  );

  useEffect(() => {
    // ✅ Only fetch if categories haven't been fetched yet
    if (!fetched) {
      dispatch(fetchCategories());
    }
  }, [dispatch, fetched]);

  if (loading) {
    return (
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2>Shop by Categories</h2>
          <p>Browse products by your favorite categories.</p>
        </div>

        <p>Loading categories...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2>Shop by Categories</h2>
          <p>Browse products by your favorite categories.</p>
        </div>

        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className={styles.categories}>
      <div className={styles.sectionHeader}>
        <h2>Shop by Categories</h2>
        <p>Browse products by your favorite categories.</p>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default Categories;
