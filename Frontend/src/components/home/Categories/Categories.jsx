import { useEffect, useState } from "react";

import CategoryCard from "./CategoryCard";
import styles from "./Categories.module.css";

import { getCategories } from "../../../services/category.service";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

        <p>Unable to load categories. Please try again later.</p>
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
