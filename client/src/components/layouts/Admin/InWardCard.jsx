import React, { Component } from "react";
import "../../../assets/search-emp/empCard.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import axios from "axios";
import ReactHTMLTableToExcel from 'react-html-table-to-excel-3';
import { QRCodeCanvas } from "qrcode.react";

//import { MDBDataTable, MDBBtn } from 'mdbreact';

export default class InWardCard extends Component {
  constructor() {
    super();
    this.state = {
      countData: [],
      type: this.props !== undefined && this.props.type ? this.props.type : "",
    };
    this.exportTableRef = React.createRef();
    this.exportTableStockRef = React.createRef();
    this.downloadRef = React.createRef();
  }

  componentDidMount = async () => {
    const inwardCount = await axios.get(process.env.REACT_APP_API_URL + "/api/admin/inwardCount");
    console.log(inwardCount.data, 'inwardCount');
    this.setState({
      countData: inwardCount.data
    })
    const token = localStorage.getItem("auth-token");
    const tokenRes = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/tokenIsValid", null, {
      headers: { "x-auth-token": token },
    });
    if (tokenRes.data) {
      //logged in
      const adminRes = await axios.get(process.env.REACT_APP_API_URL +"/api/admin", {
        headers: { "x-auth-token": token },
      });
      console.log("admin profile: ", adminRes.data.user);
      this.setState({
        admin: adminRes.data.user,
      });
    }
  }

  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  onClickTransfer = async (e, inward_id) => {
    e.preventDefault();
    this.props.history.push("/addStockTransfer/" + inward_id);
  }

  onClickDelete = async (e, inward_id) => {
    e.preventDefault();
    try {
      await axios.delete(process.env.REACT_APP_API_URL +"/api/admin/deleteStock/"+ inward_id);
      toast.notify("Deleted new product", {
        position: "top-right",
      });
      window.location.reload();
      this.props.parentCallbacks({
        status: "deleted"
      })
    } catch (err) {
      console.log("Error", e);
    }
  };

  onClickReturn = async (e, inward_id, type) => {
    e.preventDefault();
    try {
      await axios.get(process.env.REACT_APP_API_URL +"/api/admin/returnStock/"+ inward_id+ '/' + type);
      toast.notify("Changed to return status", {
        position: "top-right",
      });
      window.location.reload();
    } catch (err) {
      console.log("Error", e);
    }
  };

  onClickExcel = async (e) => {
    e.preventDefault();
    console.log("clickExcel", e.target);
  };

  imeiNumberList = (model) => {
    const number_list = []
    const dataByModel = this.props.inwardList.filter((data) => {
      return data.product.model === model;
    })
    console.log(dataByModel, 'inwardCount model')
    dataByModel.length > 0 && dataByModel.map((data) => {
      return number_list.push(data.imei_number)
    })

    return number_list.length > 0 ? number_list : [];
  };

  // generateBarCode = () => {
  //   const qrCodeURL = document.getElementById('barCodeEl')
  //     .toDataURL("image/png")
  //     .replace("image/png", "image/octet-stream");
  //   console.log(qrCodeURL)
  //   let aEl = document.createElement("a");
  //   aEl.href = qrCodeURL;
  //   const bar_name = "Bar_Code_" +  new Date().toISOString().split('T')[0] + '.png';
  //   aEl.download = bar_name;
  //   document.body.appendChild(aEl);
  //   aEl.click();
  //   document.body.removeChild(aEl);
  // };

  downloadQR = () => {
    const canvas = this.downloadRef.current.children[0];
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = "Bar_Code_" +  new Date().toISOString().split('T')[0] + '.png';
    downloadLink.href = `${pngFile}`;
    downloadLink.click();
  };

  render() {
    const { inwardList } = this.props;
    const currentdate = "stock " + this.props.type  + ' ' +  new Date().toISOString().split('T')[0];

    return (
        <div className="table table-striped sortable">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js"></script>
        <ReactHTMLTableToExcel
        id="test-table-xlsx-button"
        className="btn btn-primary pull-right"
        table="table-to-xlsx"
        filetype="xlsx"
        buttonText="Download XLSX"
        filename={currentdate}
        sheet="stock"
        currentTableRef={this.exportTableRef.current}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <ReactHTMLTableToExcel
        id="test-table-xlsx-button"
        className="btn btn-primary pull-right"
        table="table-to-xlsx"
        filetype="xls"
        buttonText="Download XLS"
        filename={currentdate}
        sheet="stock"
        currentTableRef={this.exportTableRef.current}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
      <ReactHTMLTableToExcel
        id="test-table-xlsx-button"
        className="btn btn-primary pull-right"
        table="table-to-stock"
        filetype="xlsx"
        buttonText="Download Stock XLSX"
        filename={currentdate}
        sheet="stock"
        currentTableRef={this.exportTableStockRef.current}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <ReactHTMLTableToExcel
        id="test-table-xlsx-button"
        className="btn btn-primary pull-right"
        table="table-to-stock"
        filetype="xls"
        buttonText="Download Stock XLS"
        filename={currentdate}
        sheet="stock"
        currentTableRef={this.exportTableStockRef.current}
        />

        {
          this.state.countData.length > 0 &&
          <table className="inputTable searchable sortable" id="table-to-stock" ref={this.exportTableStockRef}  style={{display: 'none'}}>
            {
              this.state.countData.map((product_data, i) => (
                <tr>
                  <td>
                     <div><b>{product_data.product.name} {" - "} {product_data.product.model} {'/ Count - '} {product_data.count}</b> </div>
                      {this.imeiNumberList(product_data.product.model).length > 0 && this.imeiNumberList(product_data.product.model).map((data) => (
                        <div>{data}</div>
                      ))}
                  </td>
                </tr>
              ))
            }
          </table>
        }
        {
            inwardList.length > 0 &&
            <table className="inputTable searchable sortable" style={{display: 'none'}} id="table-to-xlsx" ref={this.exportTableRef}>
            <tr>
            <th> Brand Name </th>
            <th> Brand Model </th>
            <th> Brand Variant </th>
            <th> Brand Color </th>
            <th>IMEI Number</th>
              <th>GST Percentage</th>
              <th>Purchase Value </th>
              <th> Selling Value</th>
              <th>Reference Invoice Number</th>
              <th>Date</th>
            </tr>
         {inwardList.map((data, index) => (
           <tr>
                <td>{data.product.name} </td>
                <td> {data.product.model} </td>
                <td> {data.product.variant} </td>
                <td> {data.product.color}</td>
                <td>{data.imei_number}</td>
                <td>{data.gst_percentage}</td>
                <td>{data.purchase_value}</td>
                <td>{data.selling_value}</td>
                <td>{data.reference_invoice_number ? data.reference_invoice_number : ''}</td>
                <td>{this.onGetDate(data.doi)}</td>
             </tr>
            ))}
            </table>
          }

          {
            inwardList.length > 0 &&
            <table className="inputTable searchable sortable">
            <tr>
            <th>Brand Details </th>
            <th>IMEI Number</th>
              <th>GST Percentage</th>
              <th>Purchase Value / Selling Value</th>
              <th>Reference Invoice Number</th>
              <th>Date</th>
             <th>
             </th>
             <th></th>
             <th></th>
             <th></th>
            </tr>
         {inwardList.map((data, index) => (
           <tr>
                <td>{data.product.name} - {data.product.model} - {data.product.variant} - {data.product.color}</td>
                <td>{data.imei_number} <br/>
                <div style={{display: 'none'}} ref={this.downloadRef} className="HpQrcode">
                <QRCodeCanvas id="barCodeEl"  value={data.imei_number} width={1} height={50} size={50} displayValue={false} style={{ margin: '20px' }} />
                </div>
                <br/><a style={{color: 'red'}}onClick={this.downloadQR}> Download OR </a> 
                </td>
                <td>{data.gst_percentage}</td>
                <td>{data.purchase_value}{ " / "}{data.selling_value}</td>
                <td>{data.reference_invoice_number ? data.reference_invoice_number : ''}</td>
                <td>{this.onGetDate(data.doi)}</td>
                <td>
                  <Link
                     to={`/editInWard/${data._id}`}
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
                   to={`/addStockTransfer/${data._id}`}
                   style={{
                     textDecoration: "none",
                     display: "flex",
                     justifyContent: "center",
                   }}
                 >
                   <i className="fa fa-exchange"></i>
                 </Link>
                </td>
                <td>
                {
                this.state.admin && this.state.admin.role === "admin" &&
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
                  }
                </td>
                {
                   (data.type === 'firstPurchase' || 
                   data.type === 'secondPurchase') && 
                   <td>
                   <Link
                        onClick={(e) => {
                          this.onClickReturn(e, data._id, data.type)
                        }}
                        to='viewProduct'
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <i className="fa fa-undo"></i>
                      </Link>
                   </td>
               }
             </tr>
            ))}
            </table>
          }

         </div>
    );
  }
}
