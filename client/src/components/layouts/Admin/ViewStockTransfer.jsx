import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import AdminSidePanel from "./AdminSidePanel";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../assets/images/noEmp.png";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { createHashHistory } from 'history'
export const history = createHashHistory()

//import "../../../assets/add-category/addCategory.css";


export default class ViewStockTransfer extends Component {
  constructor() {
    super();

    this.state = {
        stockList: [],
      loading: true,
    };
  }

  componentDidMount = async () => {
    this.getData()
  };

  getData = async () => {
    const stockList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getStockTransfer");
    console.log("List: ", stockList.data);
    this.setState({
        stockList: stockList.data,
      loading: false,
    });
  }
  // to filter data according to search criteria
  onFilter = (stockList) => {
    this.setState({ stockList });
  };

  onClickApprove = async (e, _id) => {
    e.preventDefault();
    try {
      await axios.post(process.env.REACT_APP_API_URL +"/api/admin/approveStockTransfer/"+ _id);
      this.getData()
      toast.notify("approve the stock transfer", {
        position: "top-right",
      });
      this.props.history.push(`/viewStockTransfer`);
    } catch (err) {
      console.log("Error", e);
    }
  };

  onClickReject = async (e, _id) => {
    e.preventDefault();
    try {
      await axios.post(process.env.REACT_APP_API_URL +"/api/admin/rejectStockTransfer/"+ _id);
      this.getData()
      toast.notify("rejected the stock transfer", {
        position: "top-right",
      });
      this.props.history.push(`/viewStockTransfer`);
    } catch (err) {
      console.log("Error", e);
    }
  };


  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/viewStockTransfer');
  }
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;

          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && (user.role !== "admin"  && user.role !== 'branch'))
            return <Redirect to="/empDashBoard" />;

          return (
            <Spring
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ duration: 300 }}
            >
              {(props) => (
                <>
                  <div className="row m-0">
                    {/* left part */}
                    <div className="col-2 p-0 leftPart">
                      <AdminSidePanel />
                    </div>

                    {/* right part */}
                    <div className="col " style={props}>
                    <div className="row">
                    <div className="container mt-3">
                    <h3>Stock Transfer List</h3>
                      </div>
                    </div>

                      <hr />

                      {/* branch list */}
                      {this.state.loading ? (
                        <h1 className="text-center">Loading...</h1>
                      ) : this.state.stockList.length ? (
                        <div className="table table-striped sortable">
                          <table className="inputTable searchable sortable">
                          <tr>
                          <th>Brand Details </th>
                          <th>IMEI Number</th>
                            <th>GST Percentage</th>
                            <th>Purchase Value / Selling Value</th>
                            <th>From Branch</th>
                            <th>To Branch</th>
                            <th>Date</th>
                           <th>
                           </th>
                           <th></th>
                           <th></th>
                           <th></th>
                          </tr>
                          {this.state.stockList.map((data, index) => (
                             <tr>
                              <td>{data.product.name} - {data.product.model} - {data.product.variant} - {data.product.color}</td>
                              <td>{data.imei_number}</td>
                              <td>{data.gst_percentage}</td>
                              <td>{data.purchase_value}{ " / "}{data.selling_value}</td>
                              <td>{data.branch}</td>
                              <td>{data.to_branch}</td>
                              <td>{this.onGetDate(data.doi)}</td>
                              
                              <td>
                            <Link
                                   onClick={(e) => {
                                     this.onClickApprove(e, data._id)
                                   }}
                                   to='viewStockTransfer'
                                   style={{
                                     textDecoration: "none",
                                     display: "flex",
                                     justifyContent: "center",
                                   }}
                                 >
                                   <i className="fa fa-check"></i>
                                 </Link>
                                
                              </td>
                                 <td>
                                 <Link
                                      onClick={(e) => {
                                        this.onClickReject(e, data._id)
                                      }}
                                      to='viewProduct'
                                      style={{
                                        textDecoration: "none",
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <i className="fa fa-close"></i>
                                    </Link>
                                 </td>
                             
                           </tr>
                          ))}
                          </table>
                        </div>        
                      ) : (
                        <div className="container  text-secondary text-center mt-2">
                          <img
                            src={noEmp}
                            alt=""
                            height="200px"
                            className="mt-5"
                          />
                          <h1 className="mt-4">No Stock transfer found...</h1>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
