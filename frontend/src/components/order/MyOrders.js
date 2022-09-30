import React, { Fragment, useEffect } from "react";
import "./MyOrders.css";
import { DataGrid } from "@mui/x-data-grid";
import MetaData from "../layout/MetaData";
import Loader from "../layout/loader/Loader";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import { useAlert } from "react-alert";
import LaunchIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const alert = useAlert;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { orders, error, loading } = useSelector((state) => state.myOrders);

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemQty: item.orderItems.length,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  const columns = [
    { field: "id", headerName: "order ID", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemQty",
      headerName: "Item Qty",
      type: "number",
      minWidth: 300,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "action",
      headerName: "Action",
      type: "number",
      minWidth: 150,
      sortable: false,
      // FOR GETTING THE DIANAMIC VALUE OF CELL
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];

  // IF CLEAR ERRORS
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [error, alert, dispatch]);

  return (
    <Fragment>
      <MetaData title={`${user.name} - orders`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            className="myOrdersTable"
          />

          <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
