import React, { Fragment, useEffect, useState } from "react";
import "./ProductReviews.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAllReview,
  deleteReview,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { DataGrid } from "@mui/x-data-grid";
import MetaData from "../layout/MetaData";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Star from "@mui/icons-material/Star";

import Sidebar from "./Sidebar";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import LoaderBtn from "../layout/butttonLoader/LoaderBtn";

const ProductReviews = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { reviews, error, loading } = useSelector(
    (state) => state.productReviews
  );
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.review
  );

  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReview(productId, reviewId));
  };

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Rating",
      minWidth: 180,
      type: "number",
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      type: "number",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.map((item) => {
      return rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReview(productId));
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Review deleted successfully");
      history.push("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [alert, dispatch, error, deleteError, history, isDeleted, productId]);

  const productReviewSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReview(productId));
  };

  return (
    <Fragment>
      <MetaData title="All Reviews - Admin" />

      <div className="dashboard">
        <Sidebar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={
                loading ? true : false || productId === "" ? true : false
              }
            >
              {loading ? <LoaderBtn /> : "Search"}
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
