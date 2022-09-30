import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { Country, State } from "country-state-city";
import MetaData from "../layout/MetaData";
import CheckOutSteps from "./CheckOutSteps.js";
import { saveShippingInfo } from "../../actions/cartAction";

const Shipping = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

  // SHIPPING HANDLER FUNCTION HERE
  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 10 || phoneNo.length > 10) {
      alert.error("Phone number should be 10 degits");
      return;
    }
    dispatch(saveShippingInfo({address, city, state, country, pinCode, phoneNo}));
    history.push("/order/confirm");

    return false;
  };

  return (
    <Fragment>
      <MetaData title="Shipping Details" />

      <CheckOutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>
          {/* SHIPPING FORM START */}
          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              <HomeIcon />
              <input
                type="text"
                value={address}
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <LocationCityIcon />
              <input
                type="text"
                value={city}
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div>
              <PinDropIcon />
              <input
                type="number"
                value={pinCode}
                placeholder="Pin Code"
                onChange={(e) => setPinCode(e.target.value)}
                required
              />
            </div>
            <div>
              <PhoneIcon />
              <input
                type="number"
                value={phoneNo}
                placeholder="Phone Number"
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
                required
              />
            </div>
            <div>
              <PublicIcon />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => {
                    return (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            {country && (
              <div>
                <TransferWithinAStationIcon />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => {
                      return (
                        <option key={item.isoCode} value={item.name}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
          {/* SHIPPING FORM ENDS */}
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
