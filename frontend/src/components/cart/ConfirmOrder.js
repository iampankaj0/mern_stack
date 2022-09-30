import { Typography } from "@mui/material";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import CheckOutSteps from "./CheckOutSteps";
import "./ConfirmOrder.css";

const ConfirmOrder = ({ history }) => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + shippingCharges + tax;

  const address = `${shippingInfo.address},${shippingInfo.pinCode},${shippingInfo.city},${shippingInfo.state},${shippingInfo.country},`;

  // PROCEED TO PAYMENT FUNCTION
  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    history.push("/process/payment");
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckOutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => {
                  return (
                    <div key={item}>
                      <img src={item.image} alt="product" />
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
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
        <div className="orderSummary">
          <Typography>Order Summary</Typography>
          <div>
            <div>
              <p>Subtotal:</p>
              <span> ₹{subtotal} </span>
            </div>
            <div>
              <p>Shipping Charges:</p>
              <span> ₹{shippingCharges} </span>
            </div>
            <div>
              <p>GST:</p>
              <span> ₹{tax} </span>
            </div>
          </div>
          <div className="orderSummaryTotal">
            <p>
              <b>Total:</b>
            </p>
            <span>{totalPrice}</span>
          </div>

          <button onClick={proceedToPayment}>Proceed To Payment</button>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
