
import React, { Component } from "react";
//import jsPDF from 'jspdf';
import ReportTemplate from "../ReportTemplate";
import axios from "axios";

class GenerateSalesReport extends Component {
  constructor() {
    super();
    this.state = {
        sale_id: '',
        salesCount: ''
    };
    this.reportTemplateRef = React.createRef();
  }


  componentDidMount = async () => {
    const saleId = this.props.match.params.id;
    this.setState({sale_id: saleId});
    const salesData = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getSaleData/${saleId}`);
    const branchData = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getBranchDataByName/${salesData.data.branch}`);
    const salesCount = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getSaleCount`);
    this.setState({
      branchName: process.env.REACT_APP_BILL_NAME,
      branchGst: branchData.data.gst_number,
      branchAddress: branchData.data.address,
      branchPhone: branchData.data.phoneNo,
      salesCount: salesCount.data
    });
    this.setState({
      ...salesData.data,
    });
  };

handleGeneratePdf = (e) => {
    e.preventDefault();
    window.print();
    /*const doc = new jsPDF({
			format: 'a4',
			unit: 'pt',
		});

		// Adding the fonts.
		doc.setFont('Canon', 'normal');
    doc.setFontSize(1);
    doc.setLineHeightFactor(0);
		doc.html(this.reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('document');
			},
		});*/

  };

  render() {
    return (
        <div className="text-center">
        <input
        onClick={this.handleGeneratePdf}
        type="button"
        value="Invoice"
        className="btn"
        style={{backgroundColor: 'black', color: 'white'}}
        />
        <div ref={this.reportTemplateRef}>
        <ReportTemplate {...this.state} />
        </div>
        </div>
    )
  }
}

export default GenerateSalesReport;
