import styles from "./Categories.module.css";

const CategoryCard = ({ category }) => {
  const { name, description, image } = category;

  return (
    <article className={styles.categoryCard}>
      <div className={styles.categoryImage}>
        <img src={image.url} alt={name} />
      </div>

      <div className={styles.categoryContent}>
        <h3 className={styles.categoryTitle}>{name}</h3>

        <p className={styles.categoryDescription}>{description}</p>
      </div>
    </article>
  );
};

export default CategoryCard;
