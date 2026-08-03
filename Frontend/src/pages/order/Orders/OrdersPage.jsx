import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchOrders } from "../../../features/order/orderSlice";

import OrderCard from "../../../components/order/OrderCard/OrderCard";
import EmptyOrders from "../../../components/order/EmptyOrders/EmptyOrders";

import styles from "./OrdersPage.module.css";

const OrdersPage = () => {
  const dispatch = useDispatch();

  const { orders, isFetching, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isFetching) {
    return (
      <section className={styles.ordersPage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p>Loading orders...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.ordersPage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p className={styles.error}>{error}</p>
        </div>
      </section>
    );
  }

  if (!orders.length) {
    return <EmptyOrders />;
  }

  return (
    <section className={styles.ordersPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Orders</h1>

        <div className={styles.ordersList}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;
