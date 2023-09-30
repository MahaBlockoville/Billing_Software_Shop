import React, { Component } from "react";
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
<div className="container" style={{
    margin: '20px',
    border:'black 1px solid'
  }}>
    <div className="row" style={{
    borderBottom: '1px solid black'
  }}>
        <div className="col-6 header_cell_shop_details" style={{
    margin: '0',
    paddingLeft: '5px'
  }}> 
          <div><p id="address1" style={{
    fontSize: '20px'
  }}><b>SRI VISAKA MOBILES</b></p></div>
          <p id="address2"style={{
    fontSize: '16px'
  }}><b>51B OPP SLB SCHOOL</b></p>
          <p id="address3" style={{
    fontSize: '16px'
  }}><b>COURD ROAD, NAGAR COIL - 629001 (BRANCH-3)</b></p>
          <p id="address4">Ph.04526387262 </p>
          <p id="address5">GSTIN-33DHUPS1680G1ZV</p>
        </div>
        <div className="col-6">
            <div className="row" style={{
    borderBottom: '1px solid black'
  }}>
              <div className="col-6" id="invoice" style={{
  borderRight: '1px solid black',
  padding: '0px !important'
  }}>
                 <div className="inner-details" style={{
    height: '40px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '5px'
  }} >Invoice:</div>
              </div>
              <div className="col-6" id="Date" style={{
    height: '40px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '5px'
  }}>
                <div>Date:</div>
              </div>
            </div>
            <div className="row" style={{
    borderBottom: '1px solid black'
  }}>
                <div className="inner-details" id="order" style={{
    height: '40px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '5px'
  }}>Order No:</div> 
            </div>
               <div className="inner-details" id="payment" style={{
    height: '40px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '5px'
  }}>Payment Mode:</div>  
        </div>
      </div>
    <div className="row" style={{
    borderBottom: '1px solid black'
  }}>
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
      <div className="row" style={{
    borderBottom: '1px solid black'
  }}>  
          <div className="row" id="itemheader" style={{
    borderBottom: '1px solid black',
    margin: '0',
    padding: '0'
  }}>
            <div className="col-1" style={{
                  borderRight: '1px solid black',
                  padding: '0px !important',
                  justifyContent: 'center',
                  display: 'flex',
                  fontWeight: '600'
            }}>NO</div>
            <div className="col-4" style={{
                  borderRight: '1px solid black',
                  padding: '0px !important',
                  justifyContent: 'center',
                  display: 'flex',
                  fontWeight: '600'
            }}>ITEM</div>
            <div className="col-1" style={{
                  borderRight: '1px solid black',
                  padding: '0px !important',
                  justifyContent: 'center',
                  display: 'flex',
                  fontWeight: '600'
            }}>HSN</div>
            <div className="col-1" style={{
                  borderRight: '1px solid black',
                  padding: '0px !important',
                  justifyContent: 'center',
                  display: 'flex',
                  fontWeight: '600'
            }}>QTY</div>
            <div className="col-2" style={{
                  borderRight: '1px solid black',
                  padding: '0px !important',
                  justifyContent: 'center',
                  display: 'flex',
                  fontWeight: '600'
            }}>RATE</div>
            <div className="col-1" style={{
                  borderRight: '1px solid black',
                  padding: '0px !important',
                  justifyContent: 'center',
                  display: 'flex',
                  fontWeight: '600'
            }}>GST%</div>
            <div className="col-2" id="last" style={{
              borderRight: 'none !important'
            }}>AMOUNT</div>
          </div>
          <div className="row" id="itemDetails" style={{
    borderBottom: '1px solid black'
  }}>
            <div className="col-1" style={{
        borderRight: '1px solid black',
        padding: '0px !important',
        justifyContent: 'center',
        display: 'flex',
        fontWeight: '400',
        height: '500px !important'
   }}></div>
            <div className="col-4"style={{
        borderRight: '1px solid black',
        padding: '0px !important',
        justifyContent: 'center',
        display: 'flex',
        fontWeight: '400',
        height: '500px !important'
   }}></div>
            <div className="col-1"style={{
        borderRight: '1px solid black',
        padding: '0px !important',
        justifyContent: 'center',
        display: 'flex',
        fontWeight: '400',
        height: '500px !important'
   }}></div>
            <div className="col-1" style={{
        borderRight: '1px solid black',
        padding: '0px !important',
        justifyContent: 'center',
        display: 'flex',
        fontWeight: '400',
        height: '500px !important'
   }}></div>
            <div className="col-2" style={{
        borderRight: '1px solid black',
        padding: '0px !important',
        justifyContent: 'center',
        display: 'flex',
        fontWeight: '400',
        height: '500px !important'
   }}></div>
            <div className="col-1" style={{
        borderRight: '1px solid black',
        padding: '0px !important',
        justifyContent: 'center',
        display: 'flex',
        fontWeight: '400',
        height: '500px !important'
   }}></div>
            <div className="col-2" id="last" style={{
              borderRight: 'none !important'
            }}></div>
          </div>
      </div>
    <div className="row" style={{
    borderBottom: '1px solid black'
  }}>
      <div className="col-10 totalamount" style={{
    borderRight: '1px solid black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    height: '40px'
   }}>Total Amount</div> 
      <div className="col-2 amount" style={{
     display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    height: '40px',
   }}>15000<span>.00</span></div>
    </div>
    <div className="row" style={{border:'none'}}>
      <div className="col-12 amountInWords" style={
        {
          borderBottom:'none !important',
          fontWeight: 'bold',
          height: '40px',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center'
         }
      }>Amount In Words: </div>
    </div>
  </div>
  <div className="container" style={{
    margin: '20px',
    border:'black 1px solid'
  }}>
    <div className="row" style={{
    borderBottom: '1px solid black'
  }}>
      <div className="col-12 declarations" style={{
      height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
    }}>Declarations</div>
    </div>
    <div className="row" style={{border:'none'}}>
      <div className="col-8 declarationsDetails" style={{
      borderBottom: 'none',
      borderRight: '1px black solid'
     }}>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct</div>

      <div className="col-4">
        <div className="row salesMan" style={{
    borderBottom: '1px solid black'
  }}>
          <div style={{
      borderBottom: 'none'
    }}>Sales Man: SRM3</div>
          <div style={{
      borderBottom: 'none'
    }}>Hypothecated By :</div>
      </div>
      </div>
  </div>
</div>
    <div className="signature" style={{
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    fontWeight: 'bold',
    marginLeft: '20px'
  }}>
      <div className="col-6">Received Signature: ___________________________</div>
      <div className="col-6">For Buyer Signature: _________________________</div>
    </div>
    <div className="signature2" style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    fontWeight: 'bold',
    marginLeft: '20px'
  }}>
      <div className="col-12">Authorized </div>
    </div>
</div>
    );
  }
}

export default ReportTemplate;
