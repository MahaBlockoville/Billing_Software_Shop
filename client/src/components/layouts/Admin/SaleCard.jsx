import React, { Component } from "react";
import featuredPhonePic from "../../../assets/view-emp/featuredPhone.png";
import smartPhonePic from "../../../assets/view-emp/smartPhone.png";
import accessoriesPic from "../../../assets/view-emp/accessories.png";
import "../../../assets/search-emp/empCard.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
//import { MDBDataTable, MDBBtn } from 'mdbreact';

export default class SaleCard extends Component {
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
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
             <th>Icon</th>
            <th>Name</th>
            <th>Phone</th>
             <th>IMEI/Serial Number</th>
              <th>Variant</th>
             <th>Model</th>
             <th>Color</th>
             <th>Payment Type</th>
             <th>Selling Value</th>
             <th>Date</th>
            <th></th>
           </thead>
        {salesList.map((data, index) => (
          console.log('sales data:', data.inward.variant, data.inward.color, data.inward.model),
          <tbody>
               <td>
                 <img
                   src={
                     data.category === "Smart Phone"
                       ? smartPhonePic
                       : data.category === "Featured Phone"
                       ? featuredPhonePic
                       : accessoriesPic
                   }
                   alt="profile pic"
                   width="100px"
                 />
               </td>
               <td>{data.name}</td>
               <td>{data.phone}</td>
               <td>{data.imei_number}</td>
                <td>{data.inward.variant}</td>
               <td>{data.inward.model}</td>
               <td>{data.inward.color}</td>
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
                    <i className="fa fa-edit">Edit</i>
                  </Link>
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
