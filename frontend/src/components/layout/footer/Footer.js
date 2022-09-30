import React from "react";
import playstore from "../../../images/playstore.png"
import appstore from "../../../images/istore.png"
import './Footer.css'

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftfooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android & IOS monile phone</p>
        <img src={playstore} alt="andriod" />
        <img src={appstore} alt="ios" />
      </div>
      <div className="midfooter">
        <h1>ECOMMERCE.</h1>
        <p> High Quality is our first prority</p>
        <p>copyrights 2022 &copy; Pankaj Yadav</p>
      </div>
      <div className="rightfooter">
        <h4>Follow Us:</h4>
        <a href="#!">Instagram</a>
        <a href="#!">Youtube</a>
        <a href="#!">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
