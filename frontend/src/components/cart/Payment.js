import React, { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./Payment.css";
import CreditCartIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CheckOutSteps from "./CheckOutSteps";
import { Typography } from "@mui/material";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  // useStripe,
  // useElements,
} from "@stripe/react-stripe-js";
import { useAlert } from "react-alert";
// import axios from "axios";
import { clearErrors, createOrder } from "../../actions/orderAction";

const Payment = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  // const stripe = useStripe();
  // const elements = useElements();
  const payBtn = useRef(null);

  // GET ORDER INFO FROM SESSION STORAGE
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  // const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  //  RUPEES TO PAISE
  // const paymentData = {
  //   amount: Math.round(orderInfo.totalPrice * 100),
  // };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  // SUBMIT HANDLER FUNC
  const submitHandler = async (e) => {
    e.preventDefault();
    order.paymentInfo = {
      id: Math.random(),
      status: "succeeded",
    };

    dispatch(createOrder(order));
    alert.success("Order Placed Successfully");
    history.push("/success");
    // payBtn.current.disabled = true;
    // try {
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   };
    //   const { data } = await axios.post(
    //     "/api/payment/process",
    //     paymentData,
    //     config
    //   );

    //   const client_secret = data.client_secret;

    //   if (!stripe || !elements) return;

    //   const result = await stripe.confirmCardPayment(client_secret, {
    //     payment_method: {
    //       card: elements.getElement(CardNumberElement),
    //       billing_details: {
    //         name: user.name,
    //         email: user.email,
    //         address: {
    //           line1: shippingInfo.address,
    //           city: shippingInfo.city,
    //           state: shippingInfo.state,
    //           postal_code: shippingInfo.pinCode,
    //           country: shippingInfo.country,
    //         },
    //       },
    //     },
    //   });

    //   if (result.error) {
    //     payBtn.current.disabled = false;
    //     alert.error(result.error.message);
    //   } else {
    //     if (result.paymentIntent === "succeeded") {
    //       history.push("/success");
    //     } else {
    //       alert.error("There's some issue while processing payment.");
    //     }
    //   }
    // } catch (error) {
    //   payBtn.current.disabled = false;
    //   alert.error(error.response.data.message);
    // }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckOutSteps activeStep={2} />

      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCartIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
