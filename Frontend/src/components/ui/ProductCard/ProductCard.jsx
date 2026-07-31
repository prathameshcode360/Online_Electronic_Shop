import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const { _id, name, images, price } = product;

  return (
    <article className={styles.productCard}>
      <Link to={`/products/${_id}`} className={styles.productImage}>
        <img src={images?.[0]?.url} alt={name} />
      </Link>

      <div className={styles.productContent}>
        <h3 className={styles.productName}>{name}</h3>

        <div className={styles.productPrice}>
          <span className={styles.price}>₹{price}</span>
        </div>

        <button type="button" className={styles.addToCartButton}>
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
