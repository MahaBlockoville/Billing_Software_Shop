import React, { Component } from "react";
import "../../../assets/search-emp/empCard.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { DownloadTableExcel } from 'react-export-table-to-excel';

export default class SaleCard extends Component {
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

  onClickDelete = async (e, sale_id) => {
    e.preventDefault();
    try {
      await axios.delete(process.env.REACT_APP_API_URL +"/api/admin/deleteSale/"+ sale_id);
      toast.notify("Deleted sale", {
        position: "top-right",
      });
      window.location.reload();
    } catch (err) {
      console.log("Error", e);
    }
  };

  onClickReturn = async (e, inward_id, type) => {
    e.preventDefault();
    try {
      await axios.get(process.env.REACT_APP_API_URL +"/api/admin/returnSale/"+ inward_id+ '/' + type);
      toast.notify("Changed to return status", {
        position: "top-right",
      });
      window.location.reload();
    } catch (err) {
      console.log("Error", e);
    }
  };

  render() {
    const { salesList } = this.props;
    const currentdate = "sales " + this.props.type  + ' '+ new Date().toISOString().split('T')[0];
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
         <table className="inputTable searchable sortable" ref={this.exportTableRef}>
           <tr>
            <th>Name</th>
            <th>Phone</th>
             <th>IMEI/Serial Number</th>
             <th>Brand Details </th>
             <th>Payment Type</th>
             <th>Selling Value</th>
             <th>Date</th>
            <th>
            </th>
            <th></th>
            <th></th>
            <th></th>
           </tr>
        {salesList.map((data, index) => (
          <tr>
               <td>{data.name}</td>
               <td>{data.phone}</td>
               <td>{data.imei_number}</td>
               <td>{data.inward.product.name} {" - "}{data.inward.product.model}
               {" - "}{data.inward.product.variant}
               {" - "}{data.inward.product.color}</td>
               <td>{data.payment_type}</td>
               <td>{data.selling_value}</td>
               <td>{this.onGetDate(data.dos)}</td>
               <td>
                 <Link
                    to={`/editSales/${data._id}`}
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
                   (data.type === 'wgst' || 
                   data.type === 'wogst') && 
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
               <td>
               <Link
                  to={`/salesBill/${data._id}`}

                      style={{
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa fa-money"></i>
                    </Link>
               </td>
            </tr>
           ))}
         </table>
         </div>
    );
  }
}
