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
<div className="container">
    <div className="row">
        <div className="col-6 header_cell_shop_details">
          <div><p id="address1"><b>SRI VISAKA MOBILES</b></p></div>
          <p id="address2"><b>51B OPP SLB SCHOOL</b></p>
          <p id="address3"><b>COURD ROAD, NAGAR COIL - 629001 (BRANCH-3)</b></p>
          <p id="address4">Ph.04526387262 </p>
          <p id="address5">GSTIN-33DHUPS1680G1ZV</p>
        </div>
        <div className="col-6">
            <div className="row">
              <div className="col-6" id="invoice">
                 <div className="inner-details" >Invoice:</div>
              </div>
              <div className="col-6" id="Date">
                <div>Date:</div>
              </div>
            </div>
            <div className="row">
                <div className="inner-details" id="order">Order No:</div> 
            </div>
               <div className="inner-details" id="payment" >Payment Mode:</div>  
        </div>
      </div>
    <div className="row">
        <div className="col-6 header_cell_shop_details">
          <div><p id="address1"><b>SUBATHRA JEWELLERS</b></p>
          <p id="address2"><b>NO 68,ANNANAGAR 8TH STREET</b></p>
          <p id="address3"><b>V.V.D.MAIN ROAD,TUTICORN-628002</b></p>
          <p id="address4">Ph:</p>
          </div>
        </div>
        <div className="col-6">
                <p><b>Shipping Details:</b></p>
        </div>
      </div>
      <div className="row">  
          <div className="row" id="itemheader">
            <div className="col-1">NO</div>
            <div className="col-4">ITEM</div>
            <div className="col-1">HSN</div>
            <div className="col-1">QTY</div>
            <div className="col-2">RATE</div>
            <div className="col-1">GST%</div>
            <div className="col-2" id="last" >AMOUNT</div>
          </div>
          <div className="row" id="itemDetails">
            <div className="col-1"></div>
            <div className="col-4"></div>
            <div className="col-1"></div>
            <div className="col-1"></div>
            <div className="col-2"></div>
            <div className="col-1"></div>
            <div className="col-2" id="last" ></div>
          </div>
      </div>
    <div className="row">
      <div className="col-10 totalamount">Total Amount</div> 
      <div className="col-2 amount">15000<span>.00</span></div>
    </div>
    <div className="row" style={{border:'none'}}>
      <div className="col-12 amountInWords">Amount In Words: </div>
    </div>
  </div>
  <div className="container">
    <div className="row">
      <div className="col-12 declarations">Declarations</div>
    </div>
    <div className="row" style={{border:'none'}}>
      <div className="col-8 declarationsDetails">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct</div>

      <div className="col-4">
        <div className="row salesMan">
          <div>Sales Man: SRM3</div>
          <div >Hypothecated By :</div>
      </div>
      </div>
  </div>
</div>
    <div className="signature">
      <div className="col-6">Received Signature: ___________________________</div>
      <div className="col-6">For Buyer Signature: _________________________</div>
    </div>
    <div className="signature2">
      <div className="col-12">Authorized </div>
    </div>
</div>
    );
  }
}

export default ReportTemplate;
