import React, { Component } from "react";
import branchPic from "../../../assets/view-emp/shopBranch.png";
import "../../../assets/search-emp/empCard.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import axios from "axios";

export default class BranchCard extends Component {
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  onClickDelete = async (e, supplier_id) => {
    e.preventDefault();
    try {
      await axios.delete(process.env.REACT_APP_API_URL +"/api/admin/deleteBranch/"+ supplier_id);
      window.location.reload();
      toast.notify("Deleted new supplier", {
        position: "top-right",
      });
      this.props.history.push(`/viewBranches`);
    } catch (err) {
      console.log("Error", e);
    }
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
            <div className="row">
              <div className="col-md-6">
              <Link
                    to={`/editBranch/${data._id}`}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <i className="fa fa-edit">Edit</i>
                  </Link>
              </div>
              <div className="col-md-6">
              <Link
                    onClick={(e) => {
                      this.onClickDelete(e, data._id)
                    }}
                    to='viewSupplier'
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <i className="fa fa-trash">Delete</i>
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
