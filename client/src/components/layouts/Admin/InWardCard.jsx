import React, { Component } from "react";
import "../../../assets/search-emp/empCard.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import axios from "axios";
import { DownloadTableExcel } from 'react-export-table-to-excel';

//import { MDBDataTable, MDBBtn } from 'mdbreact';

export default class InWardCard extends Component {
  constructor() {
    super();
    this.state = {
      type: this.props !== undefined && this.props.type ? this.props.type : "",
    };
    this.exportTableRef = React.createRef();
  }

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
    const currentdate = "stock " + this.props.type  + ' ' +  new Date().toISOString().split('T')[0];

    return (
        <div className="table table-striped sortable">
        <DownloadTableExcel
            filename={currentdate}
            sheet="stock"
            currentTableRef={this.exportTableRef.current}
        >
            <button className="btn btn-primary pull-right">
            <i className="fa fa-download"></i>  Export excel 
            </button>
        </DownloadTableExcel>
          {
            inwardList.length > 0 &&
            <table className="inputTable searchable sortable" ref={this.exportTableRef}>
            <tr>
            <th>Brand Details </th>
              <th>IMEI/Serial Number</th>
              <th>GST Percentage</th>
              <th>Purchase Value</th>
              <th>Selling Value</th>
              <th>Date</th>
             <th>
             </th>
             <th></th>
             <th></th>
            </tr>
         {inwardList.map((data, index) => (
           <tr>
                <td>{data.product.name} - {data.product.model} - {data.product.variant} - {data.product.color}</td>
                <td>{data.imei_number}</td>
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
                   (data.type === 'firstPurchase' || 
                   data.type === 'secondPurchase') && 
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
             </tr>
            ))}
          </table>
          }

         </div>
    );
  }
}
