import styles from "./CartItem.module.css";

const CartItem = ({ item, loading, onIncrease, onDecrease, onRemove }) => {
  const { product, quantity, isAvailable, availabilityMessage } = item;

  return (
    <article className={styles.cartItem}>
      <img
        src={product.images?.[0]?.url || "/placeholder-image.jpg"}
        alt={product.name}
        className={styles.image}
      />

      <div className={styles.details}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>₹{product.price}</p>
        {!isAvailable && (
          <p className={styles.unavailable}>{availabilityMessage}</p>
        )}
      </div>

      <div className={styles.quantityControls}>
        <button
          onClick={onDecrease}
          disabled={loading}
          className={styles.quantityBtn}
          aria-label="Decrease quantity">
          -
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button
          onClick={onIncrease}
          disabled={loading || !isAvailable}
          className={styles.quantityBtn}
          aria-label="Increase quantity">
          +
        </button>
      </div>

      <div className={styles.itemTotal}>₹{product.price * quantity}</div>

      <button
        className={styles.removeBtn}
        onClick={onRemove}
        disabled={loading}
        aria-label={`Remove ${product.name} from cart`}>
        ×
      </button>
    </article>
  );
};

export default CartItem;
