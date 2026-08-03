import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateItemQuantity,
  removeItemFromCart,
  clearUserCart,
} from "../../features/cart/cartSlice";

import CartItem from "../../components/cart/CartItem/CartItem";
import CartSummary from "../../components/cart/CartSummary/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart/EmptyCart";

import styles from "./CartPage.module.css";

const CartPage = () => {
  const dispatch = useDispatch();

  const {
    items,
    isFetching,
    isAdding,
    isClearing,
    updatingItems,
    removingItems,
  } = useSelector((state) => state.cart);

  // Only use global loading for operations that affect the whole cart
  const globalLoading = isFetching || isAdding || isClearing;

  const { totalAmount, itemCount } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        totalAmount: acc.totalAmount + item.product.price * item.quantity,
        itemCount: acc.itemCount + item.quantity,
      }),
      {
        totalAmount: 0,
        itemCount: 0,
      },
    );
  }, [items]);

  const handleIncreaseQuantity = (item) => {
    dispatch(
      updateItemQuantity({
        productId: item.product._id,
        quantity: item.quantity + 1,
      }),
    );
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity === 1) {
      dispatch(removeItemFromCart(item.product._id));
      return;
    }

    dispatch(
      updateItemQuantity({
        productId: item.product._id,
        quantity: item.quantity - 1,
      }),
    );
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearUserCart());
  };

  if (!items.length) {
    return <EmptyCart />;
  }

  return (
    <section className={styles.cartPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Shopping Cart</h1>

        <div className={styles.cartItems}>
          {items.map((item) => {
            const productId = item.product._id;
            // Per-item loading states
            const isUpdating = !!updatingItems[productId];
            const isRemoving = !!removingItems[productId];
            const itemLoading = isUpdating || isRemoving;

            return (
              <CartItem
                key={productId}
                item={item}
                loading={itemLoading}
                onIncrease={() => handleIncreaseQuantity(item)}
                onDecrease={() => handleDecreaseQuantity(item)}
                onRemove={() => handleRemoveItem(productId)}
              />
            );
          })}
        </div>

        <CartSummary
          totalAmount={totalAmount}
          itemCount={itemCount}
          loading={globalLoading}
          onClearCart={handleClearCart}
        />
      </div>
    </section>
  );
};

export default CartPage;
