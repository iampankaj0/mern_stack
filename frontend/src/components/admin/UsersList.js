import React, { Fragment, useEffect } from "react";
import "./UsersList.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import MetaData from "../layout/MetaData";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import { clearErrors, deleteUser, getAllUsers } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import Loader from "../layout/loader/Loader";

const UsersList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { users, error, loading } = useSelector((state) => state.allUsers);
  const { isDeleted, error: deleteError, message } = useSelector(
    (state) => state.updateUser
  );

  console.log("USERS " + JSON.stringify(users));

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 180,
      flex: 0.8,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      type: "number",
      flex: 0.3,
      cellClassName: (params)=>{
        return params.getValue(params.id, "role") === "admin" ? "greenColor" : "redColor"
      }
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
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>
            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
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

  users &&
    users.map((item) => {
      return rows.push({
        id: item._id,
        email: item.email,
        name: item.name,
        role: item.role,
      });
    });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success(message);
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [alert, dispatch, error, history, deleteError, isDeleted, message]);

  return (
    <Fragment>
      <MetaData title="All Users - Admin" />

      <div className="dashboard">
        <Sidebar />
        <div className="userListContainer">
          <h1 id="userListHeading">ALL USERS</h1>
          {loading ? (
            <Loader />
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="userListTable"
              autoHeight
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;
