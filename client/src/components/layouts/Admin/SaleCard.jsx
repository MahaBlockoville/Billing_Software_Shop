import React, { Component } from "react";
import "../../../assets/search-emp/empCard.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
//import { MDBDataTable, MDBBtn } from 'mdbreact';

export default class SaleCard extends Component {
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

  render() {
    const { salesList } = this.props;
      /*const data = {
        columns: [
          {
            label: 'Brand Name',
            field: 'name',
            sort: 'asc',
            width: 150
          },
          {
            label: 'IMEI/Serial Number',
            field: 'imei_number',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Variant',
            field: 'variant',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Model',
            field: 'model',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Color',
            field: 'color',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Discount',
            field: 'discount',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Purchase Value',
            field: 'purchase_value',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Selling Value',
            field: 'selling_value',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Date',
            field: 'doi',
            sort: 'asc',
            width: 150
          },
        ],
        rows: inwardList
      }  */
    <script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js"></script>
    return (
        // <MDBDataTable
        //   striped
        //   bordered
        //   small
        //   data={data}
        // />
        
        <div className="table table-striped sortable">
         <table className="inputTable searchable sortable">
           <thead>
            <th>Name</th>
            <th>Phone</th>
             <th>IMEI/Serial Number</th>
             <th>Brand Name</th>
              <th>Variant</th>
             <th>Model</th>
             <th>Color</th>
             <th>Payment Type</th>
             <th>Selling Value</th>
             <th>Date</th>
            <th></th>
            <th></th>
            <th></th>
           </thead>
        {salesList.map((data, index) => (
          <tbody>
               <td>{data.name}</td>
               <td>{data.phone}</td>
               <td>{data.imei_number}</td>
               <td>{data.inward.product.name}</td>
                <td>{data.inward.product.variant}</td>
               <td>{data.inward.product.model}</td>
               <td>{data.inward.product.color}</td>
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
               <td>
                
               </td>
            </tbody>
           ))}
         </table>
         </div>
      // <div className="mySaleCard">

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
