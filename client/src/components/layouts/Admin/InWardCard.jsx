import React, { Component } from "react";
import "../../../assets/search-emp/empCard.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import axios from "axios";

//import { MDBDataTable, MDBBtn } from 'mdbreact';

export default class InWardCard extends Component {
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  onClickDelete = async (e, inward_id) => {
    e.preventDefault();
    try {
      await axios.delete(process.env.REACT_APP_API_URL +"/api/admin/deleteStock/"+ inward_id);
      toast.notify("Deleted new product", {
        position: "top-right",
      });
      window.location.reload();
      this.props.parentCallbacks({
        status: "deleted"
      })
    } catch (err) {
      console.log("Error", e);
    }
  };

  onClickReturn = async (e, inward_id, type) => {
    e.preventDefault();
    try {
      await axios.get(process.env.REACT_APP_API_URL +"/api/admin/returnStock/"+ inward_id+ '/' + type);
      toast.notify("Changed to return status", {
        position: "top-right",
      });
      window.location.reload();
    } catch (err) {
      console.log("Error", e);
    }
  };

  render() {
    const { inwardList } = this.props;
    return (
        <div className="table table-striped sortable">
          {
            inwardList.length > 0 &&
            <table className="inputTable searchable sortable">
            <thead>
             <th>Brand Name</th>
              <th>IMEI/Serial Number</th>
              <th>Variant</th>
              <th>Model</th>
              <th>Color</th>
              <th>GST Percentage</th>
              <th>Purchase Value</th>
              <th>Selling Value</th>
              <th>Date</th>
             <th></th>
             <th></th>
             <th></th>
            </thead>
         {inwardList.map((data, index) => (
           <tbody>
                <td>{data.product.name}</td>
                <td>{data.imei_number}</td>
                <td>{data.product.variant}</td>
                <td>{data.product.model}</td>
                <td>{data.product.color}</td>
                <td>{data.gst_percentage}</td>
                <td>{data.purchase_value}</td>
                <td>{data.selling_value}</td>
                <td>{this.onGetDate(data.doi)}</td>
                <td>
                  <Link
                     to={`/editInWard/${data._id}`}
                     style={{
                       textDecoration: "none",
                       display: "flex",
                       justifyContent: "center",
                     }}
                   >
                     <i className="fa fa-edit"></i>
                   </Link>
                </td>
                <td>
                <Link
                     onClick={(e) => {
                       this.onClickDelete(e, data._id)
                     }}
                     to='viewProduct'
                     style={{
                       textDecoration: "none",
                       display: "flex",
                       justifyContent: "center",
                     }}
                   >
                     <i className="fa fa-trash"></i>
                   </Link>
                </td>
                {
                   (data.type === 'first' || 
                   data.type === 'second') && 
                   <td>
                   <Link
                        onClick={(e) => {
                          this.onClickReturn(e, data._id, data.type)
                        }}
                        to='viewProduct'
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <i className="fa fa-undo"></i>
                      </Link>
                   </td>
               }
             </tbody>
            ))}
          </table>
          }

         </div>
      // <div className="myInWardCard">

      //   <div className="row">
      //     <div
      //       className="col"
      //       style={{ display: "flex", justifyContent: "center" }}
      //     >
      //       <img
      //         src={data.category === "Smart Phone" ? smartPhonePic : data.category === "Featured Phone" ? featuredPhonePic : accessoriesPic}
      //         alt="profile pic"
      //         width="100px"
      //       />
      //     </div>
      //   </div>

      //   <hr />

      //   <div className="row">
      //     <div className="col p-0">
      //       <span className="text-center">
      //         <h4>{data.name.toUpperCase()}</h4>
      //       </span>
      //       <div className="text-center">
      //         <span>
      //         <span>Model: {data.model}</span> <br />
      //         <span>Variant: {data.variant}</span> <br />
      //         <span>Color: {data.color}</span> <br />

      //           <i className="fas fa-calendar-alt">
      //             {" "}
      //             {this.onGetDate(data.doi)}
      //           </i>
      //           <br />
      //           <Link
      //             to={`/editInWard/${data._id}`}
      //             style={{
      //               textDecoration: "none",
      //               display: "flex",
      //               justifyContent: "center",
      //             }}
      //           >
      //             <i className="fa fa-edit">Edit</i>
      //           </Link>
      //         </span>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}
