
import React, { Component } from "react";
import jsPDF from 'jspdf';
import ReportTemplate from "../ReportTemplate";
import axios from "axios";

class GenerateSalesReport extends Component {
  constructor() {
    super();
    this.state = {
        sale_id: '',
    };
    this.reportTemplateRef = React.createRef();
  }


  componentDidMount = async () => {
    const saleId = this.props.match.params.id;
    this.setState({sale_id: saleId});
    const salesData = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getSaleData/${saleId}`);
    const branchData = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getBranchDataByName/${salesData.data.branch}`);
    this.setState({
      branchAddress: branchData.data.address,
      branchPhone: branchData.data.phoneNo,
    });
    this.setState({
      ...salesData.data,
    });
  };

handleGeneratePdf = (e) => {
    e.preventDefault();
    const doc = new jsPDF({
			format: 'a4',
			unit: 'px',
		});

		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');
    doc.setFontSize(8);
    doc.setLineHeightFactor(1);
		doc.html(this.reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('document');
			},
		});

  };

  render() {
    return (
        <div>
        <input
        onClick={this.handleGeneratePdf}
        type="button"
        value="Generate PDF"
        className="btn btn-primary"
        />
        <div ref={this.reportTemplateRef}>
        <ReportTemplate {...this.state} />
        </div>
        </div>
    )
  }
}

export default GenerateSalesReport;
