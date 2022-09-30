import { Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearErrors,
  getOrderDetails,
  updateOrder,
} from "../../actions/orderAction";
import Loader from "../layout/loader/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Button } from "@mui/material";
import LoaderBtn from "../layout/butttonLoader/LoaderBtn";
import { UPDATE_ORDERS_RESET } from "../../constants/orderConstants";
import "./ProcessOrder.css";

const ProcessOrder = ({ match }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);

  const [status, setStatus] = useState("");

  // PROCEED TO PAYMENT FUNCTION
  const updateOrderStatus = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("status", status);

    dispatch(updateOrder(match.params.id, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDERS_RESET });
    }
    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, alert, error, match.params.id, updateError, isUpdated]);

  return (
    <Fragment>
      <MetaData title="Process Order" />

      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer border-left">
          {loading ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display: order.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
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
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {order.orderItems &&
                      order.orderItems.map((item) => {
                        return (
                          <div key={item}>
                            <img src={item.image} alt="product" />
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                            <span>
                              {item.quantity} x ₹{item.price} = ₹
                              {item.quantity * item.price}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              {/* Order Summary */}
              <div
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  encType="multipart.form-data"
                  onSubmit={updateOrderStatus}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Choose Status</option>
                      {order.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}
                      {order.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    {loading ? <LoaderBtn /> : "Process"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
