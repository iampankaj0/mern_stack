import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
import { FaUserAlt, FaSearch, FaCartPlus } from "react-icons/fa";

const Header = () => {
  return (
    <div>
      <ReactNavbar
        // burgerColor="#eb4034"
        burgerColorHover="#a62d24"
        logo={logo}
        logoWidth="6vmax"
        navColor1="#fff"
        logoHoverSize="10px"
        logoHoverColor="#eb4034"
        link1Text="Home"
        link2Text="Products"
        link3Text="Contact"
        link4Text="About"
        link1Url="/home"
        link2Url="/products"
        link3Url="/contact"
        link4Url="/about"
        link1Size="1.2vmax"
        link1Color="rgba(35, 35, 35, 0.8)"
        nav1justifyContent="flex-end"
        nav2justifyContent="flex-end"
        nav3justifyContent="flex-start"
        link1ColorHover="#eb4034"
        link1Margin="1vmax"
        profileIcon={true}
        profileIconUrl="/login"
        ProfileIconElement={FaUserAlt}
        searchIcon={true}
        SearchIconElement={FaSearch}
        cartIcon={true}
        CartIconElement={FaCartPlus}
        profileIconColor="rgba(35, 35, 35, 0.8)"
        searchIconColor="rgba(35, 35, 35, 0.8)"
        cartIconColor="rgba(35, 35, 35, 0.8)"
        profileIconColorHover="#eb4034"
        searchIconColorHover="#eb4034"
        cartIconColorHover="#eb4034"
        cartIconMargin="1vmax"
      />
    </div>
  );
};

export default Header;
