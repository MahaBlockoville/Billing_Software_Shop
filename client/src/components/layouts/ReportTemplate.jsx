import React, { Component } from "react";
import "toasted-notes/src/styles.css";
import "../../assets/billTemplate.css";

class ReportTemplate extends Component {
  constructor() {
    super();
    this.state = {
      ...this.props,
    };
  }

  render() {
    return (
      <div className="bill-template">
      <div className="container">
        <div className="brand-section section1">
            <div className="row">
                <div className="col-6">
                    <h4 className="text-white">{this.props.branch}</h4>
                </div>
                <div className="col-6">
                    <div className="company-details">
                        <p className="text-white">{this.props.branchAddress}</p>
                        <p className="text-white">{this.props.branchPhone}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="body-section section2">
            <div className="row">
                <div className="col-6">
                    <h2 class="heading">Buyer Details</h2>
                    <p className="sub-heading"> {this.props.name} </p>
                    <p className="sub-heading"> {this.props.email} </p>
                    <p className="sub-heading"> {this.props.phone} </p>
                    <p className="sub-heading"> {this.props.address}  </p>
                </div>
                <div className="col-6">
                <p className="sub-heading"> {this.props.dos} </p>
                <p className="sub-heading">Paid: {this.props.payment_type}</p>
                </div>
            </div>
        </div>

        <div className="body-section section3">
            <table className="table-bordered">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th className="w-20">Price</th>
                        <th className="w-20">Quantity</th>
                        <th className="w-20">Grandtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{
                          this.props.inward && this.props.inward.product ?
                           this.props.inward.product.name + ' ' + this.props.inward.product.model
                           + ' ' + this.props.inward.product.variant + ' ' + this.props.inward.product.color
                           : ""
                        }</td>
                        <td className="text-center">{this.props.selling_value}</td>
                        <td className="text-center">1</td>
                        <td className="text-center">{this.props.selling_value - (this.props.selling_value * (this.props.gst_percentage / 100))}</td>
                    </tr>
                    <tr>
                        <td colspan="3" className="text-right">CGST</td>
                        <td className="text-center"> {((this.props.selling_value * (this.props.gst_percentage / 100))) / 2}</td>
                    </tr>
                    <tr>
                        <td colspan="3" className="text-right">SGST</td>
                        <td className="text-center"> {((this.props.selling_value * (this.props.gst_percentage / 100))) / 2}</td>
                    </tr>
                    <tr>
                        <td colspan="3" className="text-right">Total</td>
                        <td className="text-center"> {this.props.selling_value}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div className="body-section section4">
            <p> 
              Terms And Conditions. 
            </p>
            <ul>
              <li>
                Mobile, Tablet & Accessories are warranted for a period defined by the respective manufactures against defect in material 
              </li>
              <li>
                 The shop Is not giving the warranty and does not hold out any warranty of products sold.
              </li>
              <li>
                 The shop will not be responsible for any defect/ deficient or otherwise unsatisfactory products.
              </li>
              <li>
                Goods once sold cannot be returred or exchanged
              </li>
            </ul>
        </div>      
      </div>  
      </div>
    );
  }
}

export default ReportTemplate;
