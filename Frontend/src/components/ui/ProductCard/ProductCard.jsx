import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addItemToCart } from "../../../features/cart/cartSlice";

import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const { _id, name, images, price } = product;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.cart);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(
      addItemToCart({
        productId: _id,
        quantity: 1,
      }),
    );
  };

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

        <button
          type="button"
          className={styles.addToCartButton}
          onClick={handleAddToCart}
          disabled={loading}>
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
