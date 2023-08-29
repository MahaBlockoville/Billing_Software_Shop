import React, { Component } from "react";
import branchPic from "../../../assets/view-emp/shopBranch.png";
import "../../../assets/search-emp/empCard.css";

export default class BranchCard extends Component {
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  render() {
    const { data } = this.props;

    return (
      <div className="myCard">
        <div className="row">
          <div
            className="col"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={branchPic}
              alt="profile pic"
              width="100px"
            />
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col p-0">
            <span className="text-center">
              <h4>{data.name.toUpperCase()}</h4>
            </span>
            <div className="text-center">
              <span>
              <span>Address: {data.address}</span> <br />
              <span>Phone: {data.phoneNo}</span> <br />

                <i className="fas fa-calendar-alt">
                  {" "}
                  {this.onGetDate(data.dop)}
                </i>
              </span>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
