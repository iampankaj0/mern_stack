import React, { Fragment } from "react";
import MetaData from "../MetaData";
import "./Loader.css";

const Loader = () => {
  return (
    <Fragment>
      <MetaData title="Loading" />
      <div className="loading">
        <div></div>
      </div>
    </Fragment>
  );
};

export default Loader;
