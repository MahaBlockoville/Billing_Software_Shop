import React, { Component } from "react";
import "../../assets/billTemplate.css";
import { ToWords } from 'to-words';
import moment from 'moment';
import mobihub  from "../../assets/images/mobihub_icon.jpeg";

const toWords = new ToWords();
let body = document.querySelector('body');

body.style.setProperty('-webkit-print-color-adjust', 'exact');

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
       <table className="table" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
  <tr style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td className="header-cell" id="header-cell" colspan="4" rowspan="4" style={{backgroundImage: `url(${mobihub})`, backgroundRepeat: "no-repeat", border: '3px solid black', backgroundPosition: 'right', backgroundSize: '250px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      <div className="header_cell_shop_details">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>{this.props.branchName}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>{this.props.branchAddress}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>Ph: {this.props.branchPhone} </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>GSTIN: {this.props.branchGst} </div>
      </div>
    </td>
    <td colspan="2" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
        <div>Invoice:</div>
        <span id="invoice_number">{this.props.invoice_id}</span>
      </div>
  </td>
    <td colspan="2" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
        <div>Date:</div>
        <span id="Date">
          {
          moment(this.props.dos).format(
            'DD MMM YYYY'
          )
          }
        </span>
      </div>
    </td>
  </tr>
  <tr style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td colspan="3" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
        <div>Order No:</div>
        <span id="Order No">{this.props.order_no ? this.props.order_no : this.props.order_no}</span>
      </div>
    </td>
  </tr>
  <tr style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td colspan="3" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
        <div>Payment Mode:</div>
        <span id="Payment Mode">{this.props.payment_type}</span>
      </div>
    </td>
    </tr>
  <tr style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
  </tr>
  <tr style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td className="header-cell" id="header-cell" colspan="2" rowspan="2"style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      <div className="header_cell_shop_details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bolder'}}>
         <div>Buyer Details:</div>
        <div id="Buyer Details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>
          <div>{this.props.name} </div>
          <div> {this.props.address} </div>
          <div>{this.props.phone}</div> 
          </div>
      </div>
    </td>
    <td className="header-cell" id="header-cell2" colspan="5" rowspan="2" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
        <div className="header_cell_shop_details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bolder'}}>
         <div>Shipping Details:</div>
         <div id="Shipping Details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>
          <div >{this.props.shipping_name ? this.props.shipping_name : ''} </div>
          <div>{this.props.shipping_address ? this.props.shipping_address : ''} </div>
          <div> {this.props.shipping_phone ? this.props.shipping_phone : ''}</div>
          </div>
        </div>
    </td>
    </tr>
  <tr style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
  </tr>
  <tr style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold',border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>NO</td>
    <td className="item_cell" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>ITEM</td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>HSN</td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>QTY</td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>RATE</td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>GST%</td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>AMOUNT</td>
  </tr>
  <tr className="bold" style={
    {
    //backgroundImage: `url(${mobihub})`, 
    backgroundRepeat: "no-repeat", 
    backgroundPosition: 'center', 
    border: '3px solid black',
    WebkitPrintColorAdjust: 'exact', 
    printColorAdjust: 'exact',
    //filter: 'opacity(30%)',
    //fontWeight: 'bold',
    fontSize: '18px',
    height: '300px',
    backgroundSize: '400px'}
    }>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}> 1 </td>
    <td className="item_cell" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      <div>
      {
      this.props.inward && this.props.inward.product ?
        this.props.inward.product.name + ' ' + this.props.inward.product.model
        + ' ' + this.props.inward.product.variant + ' ' + this.props.inward.product.color
        : ""
    }
      </div>
      <div>
        {
          this.props.imei_number
        }
      </div>
    
    </td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>1</td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>{this.props.selling_value - (this.props.selling_value * (this.props.gst_percentage / 100))}</td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>{this.props.gst_percentage}</td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>{this.props.selling_value - (this.props.selling_value * (this.props.gst_percentage / 100))}</td>
  </tr>
  <tr className="bold" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold', border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td className="item_cell" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      CGST {this.props.gst_percentage / 2} %
    </td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}> {parseFloat(((this.props.selling_value * (this.props.gst_percentage / 100))) / 2).toFixed(2)}</td>
  </tr>
  <tr className="bold" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold', border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td className="item_cell" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      SGST {this.props.gst_percentage / 2} %
    </td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}></td>
    <td style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}> {parseFloat(((this.props.selling_value * (this.props.gst_percentage / 100))) / 2).toFixed(2)}</td>
  </tr>
  <tr style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold', border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td colspan="3">Total Amount</td>
    <td></td>
    <td></td>
    <td></td>
    <td>{parseInt(this.props.selling_value) + '.00'}</td>
  </tr>
  <tr style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold', border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td colspan="8"> Amount In Words: <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>
      {
        this.props.selling_value !== undefined &&
        toWords.convert(parseInt(this.props.selling_value))
      }
      </div>
      </td>
  </tr>
</table>


  <table className="table  declarations" style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
  <tr style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}> 
    <td colspan="8" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold', border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>Declarations</td>
  </tr>
  <tr style={{border: '3px solid black'}}>
    <td colspan="4" rowspan="2" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal', verticalAlign: 'middle', border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct</td>
    <td colspan="4" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold'}}>
      Sales Man: 
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>
      {this.props.sales_person}
      </div>
    </td>
  </tr>
  <tr style={{border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
    <td colspan="4" style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'bold', border: '3px solid black', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
      Hypothecated By : 
      <div style={{ alignItems: 'flex-start', fontSize: '17px', fontWeight: 'normal'}}>
      {this.props.finance_name}
      </div>
    </td>
  </tr>
  </table>

  <div className="signature" style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
        fontWeight: 'bold',
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
