import React, { Component } from "react";
import { Link } from "react-router-dom";
import maleProfilePic from "../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../assets/view-emp/femaleUserPic.png";
import "../../../assets/search-emp/empCard.css";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import axios from "axios";

export default class EmpCard extends Component {
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  onClickDelete = async (e, supplier_id) => {
    e.preventDefault();
    try {
      await axios.delete(process.env.REACT_APP_API_URL +"/api/admin/deleteUser/"+ supplier_id);
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
              src={data.gender === "Male" ? maleProfilePic : femaleProfilePic}
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

              <p style={{ fontSize: "13px" }}>
                <i className="fas fa-envelope"> {data.email}</i>
              </p>
            </span>
            <div className="text-center">
              <span>Branch: {data.branch}</span> <br />
              <span>Role: {data.role}</span> <br />
              <span>
                <i className="fas fa-calendar-alt">
                  {" "}
                  {this.onGetDate(data.doj)}
                </i>
              </span>
              <br />
              {/* {data.skills ? <small>Skills: {data.skills}</small> : null} */}
            </div>
            <hr />
            <div className="row">
              <div className="col-md-6">
              <Link
                    to={`/editEmpProfile/${data._id}`}
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
