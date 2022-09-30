import { Typography } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearErrors, getOrderDetails } from "../../actions/orderAction";
import Loader from "../layout/loader/Loader";
import MetaData from "../layout/MetaData";
import "./OrderDetails.css";

const OrderDetails = ({ match }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { order, error, loading } = useSelector((state) => state.orderDetails);

  // HANDLE ERROS OR DISPATCH ORDER_DETAILS FUNCTION
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(match.params.id));
  }, [error, alert, dispatch, match.params.id]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Order Details" />
          <div className="orderDetailsPage">
            <Typography component="h1">Order #{order && order._id}</Typography>
            <div className="orderDetailsContainer">
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{order.user && order.user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>{order.user && order.shippingInfo.phoneNo}</span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>
                    {order.shippingInfo &&
                      `${order.user && order.shippingInfo.address},
                        ${order.user && order.shippingInfo.city},
                        ${order.user && order.shippingInfo.pinCode},
                        ${order.user && order.shippingInfo.state},
                        ${order.user && order.shippingInfo.country}`}
                  </span>
                </div>
              </div>
              <Typography>Payment:</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div>
                <div>
                  <p>Amount:</p>
                  <span>{order.totalPrice && order.totalPrice}</span>
                </div>
              </div>
              <Typography>Order status:</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.orderStatus && order.orderStatus === "Delivered"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {order.orderStatus && order.orderStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="orderDetailsCartItems">
            <Typography>Order Items:</Typography>
            <div className="orderDetailsCartItemsContainer">
              {order.orderItems &&
                order.orderItems.map((item) => {
                  return (
                    <div key={item.product}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      <span>
                        {item.quantity} x {item.price} ={" "}
                        <b> {item.quantity * item.price} </b>
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
