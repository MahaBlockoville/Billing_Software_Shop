import React, { Component } from "react";
import "toasted-notes/src/styles.css";
import "../../assets/billTemplate.css";
import visaka  from "../../assets/images/visaka_icon.jpeg";

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
                <td className="header-cell" colspan="4" rowspan="3">
        <div className="header_cell_shop_details">
                    <div>SRI VISAKA MOBILES  </div><br/>
                    <div> 51B OPP SLB SCHOOL </div><br/>
                <div>COURD ROAD,NAGAR COIL -629001 (BRANCH-3) <br/>
            </div>
        </div>
</td>
                    <td colspan="2">D</td>
                        <td colspan="2">E</td>
                    </tr>
                                    <tr>
                        <td colspan="2">F</td>
                        <td colspan="2">G</td>
                    </tr>
                    <tr>
                      <td colspan="2">H</td>
      <td colspan="2">I</td>
                    </tr>
                    <tr>
                    <td className="header-cell" colspan="4" rowspan="2">B</td>
      <td colspan="2">J</td>
      <td colspan="2">K</td>
                    </tr>
                    <tr>
                    <td colspan="2">L</td>
      <td colspan="2">M</td>
                    </tr>
                    <tr>
                    <td>NO</td>
      <td className="item_cell">ITEM</td>
      <td>HSN</td>
      <td>QTY</td>
      <td>RATE</td>
      <td>GST%</td>
      <td>AMOUNT</td>
    </tr>
    
    <tr className="bold">
      <td></td>
      <td className="item_cell"></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
                    </tr>

                    <tr>
                        <td colspan="3">Total Amount</td>
      <td></td>
      <td></td>
      <td></td>
                        <td>Your Total Amount</td>
    </tr>
   
    <tr>
      <td colspan="8">Amount In Words</td>
    </tr>
  </table>

  <table className="declarations table table-bordered">
  <tr>
    <td colspan="8">Declarations</td>
                    </tr>
                    <tr>
                        <td colspan="4" rowspan="2">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct</td>
                        <td colspan="4">Sales Man: SRM3</td>
                    </tr>
                    <tr>
                        <td colspan="4">Hypothecated By : </td>
                    </tr>
                            </table>

  <div className="signature">
  <div>Received Signature: ___________________________</div> 
   <div> For Buyer Signature: _________________________ </div> 
  </div>
  <div className="signature2">
    Authorized Signature: _________________________
        </div>

        <div className="footer">
    Thank you for your business. This is a computer-generated invoice.      
      </div>  
      </div>
    );
  }
}

export default ReportTemplate;
