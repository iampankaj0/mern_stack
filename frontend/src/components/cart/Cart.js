import { Typography } from "@mui/material";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import "./Cart.css";
import CartItemCart from "./CartItemCart.js";
import { useAlert } from "react-alert";

const Cart = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // DECREASE EXISTING ITEM
  const decreaseItem = (id, quantity, stock) => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      dispatch(addItemsToCart(id, newQty));
    } else {
      alert.info("Minimum quantity of 1 is required");
    }
  };

  // INCREASE EXISTING ITEM
  const increaseItem = (id, quantity, stock) => {
    if (quantity < stock) {
      const newQty = quantity + 1;
      dispatch(addItemsToCart(id, newQty));
    } else {
      alert.info("You added maximum products in your cart");
    }
  };

  // DELETE ITEM FROM CART
  const deleteCartItem = (id) => {
    dispatch(removeItemsFromCart(id));
    alert.success("Item removed successfully from your cart");
  };

  // CHECK OUT HANDLER FUNCTION
  const checkOutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No Product in your cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cartItems &&
              cartItems.map((item) => {
                return (
                  <div className="cartContainer" key={item.product}>
                    <CartItemCart item={item} deleteCartItem={deleteCartItem} />
                    <div className="cartInput">
                      <button
                        onClick={() =>
                          decreaseItem(item.product, item.quantity, item.stock)
                        }
                      >
                        -
                      </button>
                      <input type="number" value={item.quantity} readOnly />
                      <button
                        onClick={() =>
                          increaseItem(item.product, item.quantity, item.stock)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p className="cartSubtotal">{`₹${
                      item.price * item.quantity
                    }`}</p>
                  </div>
                );
              })}

            <div className="cartGrossTotal">
              <div></div>
              <div className="cartGrossTotalBox">
                <p>Gross Total</p>
                <p>
                  {`₹${cartItems.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )}`}
                </p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkOutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
