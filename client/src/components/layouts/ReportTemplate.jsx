import React, { Component } from "react";
import "toasted-notes/src/styles.css";
import "../../assets/billTemplate.css";
import { ToWords } from 'to-words';
import visaka  from "../../assets/images/visaka_icon.jpeg";

const toWords = new ToWords();

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
       <table className="table table-bordered">
  <tr>
    <td className="header-cell" id="header-cell" colspan="4" rowspan="4" style={{backgroundImage: `url(${visaka})`, backgroundRepeat: "no-repeat", backgroundPosition: 'right', backgroundSize: '250px'}}>
      <div className="header_cell_shop_details">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>SRI VISAKA MOBILES</div><br/>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>{this.props.branchAddress}</div><br/>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>Ph: {this.props.branchPhone}  GSTIN: {this.props.branchGst}</div>
      </div>
    </td>
    <td colspan="2" >
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
        <div>Invoice:</div>
        <span id="invoice_number">{this.props.invoice_id}</span>
      </div>
  </td>
    <td colspan="2" >
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
        <div>Date:</div>
        <span id="Date">{this.props.dos}</span>
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="3">
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
        <div>Order No:</div>
        <span id="Order No">{this.props.order_no ? this.props.order_no : this.props.order_no}</span>
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="3">
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
        <div>Payment Mode:</div>
        <span id="Payment Mode">{this.props.payment_type}</span>
      </div>
    </td>
    </tr>
  <tr>
  </tr>
  <tr>
    <td className="header-cell" id="header-cell" colspan="2" rowspan="2">
      <div className="header_cell_shop_details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
         <div>Buyer Details:</div>
        <span id="Buyer Details">{this.props.name} - {this.props.address} - {this.props.phone}</span>
      </div>
    </td>
    <td className="header-cell" id="header-cell2" colspan="5" rowspan="2">
        <div className="header_cell_shop_details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
         <div>Shipping Details:</div>
         <span id="Shipping Details">{this.props.shipping_name ? this.props.shipping_name : ''} 
         - {this.props.shipping_address ? this.props.shipping_address : ''} 
         - {this.props.shipping_phone ? this.props.shipping_phone : ''}</span>
        </div>
    </td>
    </tr>
  <tr>
  </tr>
  <tr style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
    <td>NO</td>
    <td className="item_cell">ITEM</td>
    <td>HSN</td>
    <td>QTY</td>
    <td>RATE</td>
    <td>GST%</td>
    <td >AMOUNT</td>
  </tr>
  <tr className="bold" style={
    {
    //backgroundImage: `url(${visaka})`, 
    backgroundRepeat: "no-repeat", 
    backgroundPosition: 'center', 
    //filter: 'opacity(30%)',
    //fontWeight: 'bold',
    fontSize: '22px',
    height: '450px',
    backgroundSize: '400px'}
    }>
    <td> 1 </td>
    <td className="item_cell">
    {
      this.props.inward && this.props.inward.product ?
        this.props.inward.product.name + ' ' + this.props.inward.product.model
        + ' ' + this.props.inward.product.variant + ' ' + this.props.inward.product.color
        + " " + this.props.imei_number
        : ""
    }
    </td>
    <td></td>
    <td>1</td>
    <td>{this.props.selling_value - (this.props.selling_value * (this.props.gst_percentage / 100))}</td>
    <td>{this.props.gst_percentage}</td>
    <td>{this.props.selling_value - (this.props.selling_value * (this.props.gst_percentage / 100))}</td>
  </tr>
  <tr className="bold" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
    <td></td>
    <td className="item_cell">
      CGST {this.props.gst_percentage / 2} %
    </td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td> {parseFloat(((this.props.selling_value * (this.props.gst_percentage / 100))) / 2).toFixed(2)}</td>
  </tr>
  <tr className="bold" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
    <td></td>
    <td className="item_cell">
      SGST {this.props.gst_percentage / 2} %
    </td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td> {parseFloat(((this.props.selling_value * (this.props.gst_percentage / 100))) / 2).toFixed(2)}</td>
  </tr>
  <tr style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
    <td colspan="3">Total Amount</td>
    <td></td>
    <td></td>
    <td></td>
    <td>{parseInt(this.props.selling_value)}</td>
  </tr>
  <tr style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
    <td colspan="8">{
      this.props.selling_value !== undefined &&
      'Amount In Words:' + toWords.convert(parseInt(this.props.selling_value))
  }</td>
  </tr>
</table>


  <table className="table table-bordered declarations">
  <tr>
    <td colspan="8" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bolder'}}>Declarations</td>
  </tr>
  <tr>
    <td colspan="4" rowspan="2" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct</td>
    <td colspan="4" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>Sales Man: {this.props.sales_person}</td>
  </tr>
  <tr>
    <td colspan="4" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>Hypothecated By : {this.props.finance_name}</td>
  </tr>
  </table>

  <div className="signature" style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
        fontWeight: 'bold'
  }}>
<div>Received Signature: </div> 
   <div> For Buyer Signature: </div> 
  </div>
  <div className="signature2" style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '75px',
        fontWeight: 'bold',
        marginLeft: '170px',
  }}>
    <div></div>
    <div>Authorized Signature:</div> 
  </div>

  <div className="footer">
    Thank you for your business. This is a computer-generated invoice.
  </div>
      </div>
    );
  }
}

export default ReportTemplate;
