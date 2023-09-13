import axios from "axios";
import React, { Component } from "react";
import AdminSidePanel from "./AdminSidePanel";
import "../../../assets/payroll/payroll.css";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../assets/images/noEmp.png";

export default class Payroll extends Component {
  constructor() {
    super();

    this.state = {
      itemList: [],
      loading: true,
      from_date: '',
      to_date: '',
      selectedMonth: "Select Month",
      empReceiptsList: [],
    };

    this.curYear = new Date().getFullYear();

    this.month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  }

  componentDidMount = async () => {
    const itemList = await axios.get(
      process.env.REACT_APP_API_URL + "/api/admin/getDayBook"
    );
    console.log("List: ", itemList);
    this.setState({
      itemList: itemList.data,
      loading: false,
    });
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e) => {
    e.preventDefault();

    let { from_date, to_date } = this.state;

    try {
      const itemList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getDayBook?from_date=" + from_date + "&to_date=" + to_date);

      console.log("List: ", itemList);
      this.setState({
        itemList: itemList.data,
        loading: false,
      });
    } catch (err) {
      console.log("Error: ", err.response.data);
    }

  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;

          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && user.role !== "admin")
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
                    <div className="col mt-3" style={props}>
                      <div className="container">
                        {/* select month */}
                        <form onSubmit={this.onSubmit}>

                        <div className="row">
                          <div className="col">
                          <label htmlFor="doj">From Date</label>
                        <div className="form-group">
                          <input
                            placeholder="Date"
                            name="from_date"
                            type="date"
                            id="from_date"
                            className="form-control"
                            onChange={this.onChange}
                          />
                        </div>
                          </div>
                          <div className="col">
                          <label htmlFor="doj">To Date</label>
                        <div className="form-group">
                          <input
                            placeholder="Date"
                            name="to_date"
                            type="date"
                            id="to_date"
                            className="form-control"
                            onChange={this.onChange}
                          />
                        </div>
                        </div>
                        <div className="col">
                        <div className="form-group m-0 p-0">
                        <button className="btn btn-primary">
                          <i
                            className="fas fa-search p-2"
                            style={{ cursor: "pointer", fontSize: "20px" }}
                          ></i>
                        </button>
                        </div>
                        </div>
                        </div>
                        </form>

                      {/* branch list */}
                      {this.state.loading ? (
                        <h1 className="text-center">Loading...</h1>
                      ) : this.state.itemList.length ? (
                        <div className="container">
                          <h1 className="my-3 text-right text-secondary">
                              Payroll table for {this.state.selectedMonth},{" "}
                              {this.curYear}
                            </h1>
                          <div
                            className="row"
                            style={{
                              display: "flex",
                            }}
                          >
                            <div className="table table-striped sortable">
                              <table className="inputTable searchable sortable">
                                <thead>
                                  <th>Name</th>
                                  <th>Model</th>
                                  <th>Variant</th>
                                  <th>Color</th>
                                  <th>Branch</th>
                                    <th>IMEI Number</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                  <th></th>
                                  <th></th>
                                </thead>
                                {this.state.itemList.map((data, index) => (
                                  <tbody>
                                    <td>{data.product && data.product.name ? data.product.name : data.inward.product.name}</td>
                                    <td>{data.product && data.product.model ? data.product.model : data.inward.product.model}</td>
                                    <td>{data.product && data.product.variant ? data.product.variant : data.inward.product.variant}</td>
                                    <td>{data.product && data.product.color ? data.product.color : data.inward.product.color}</td>
                                    <td>{data.branch}</td>
                                    <td>{data.imei_number ? data.imei_number : data.inward.product.imei_number}</td>
                                    <td>{data.product && data.product.category ? data.product.category.name : data.inward.product.category.name}</td>
                                    <td>{data.selling_value }</td>
                                    <td>{data.type}</td>
                                    <td>{data.doi ? data.doi : data.dos }</td>
                                    <td></td>
                                    <td></td>
                                  </tbody>
                                ))}
                              </table>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="container  text-secondary text-center mt-2">
                          <img
                            src={noEmp}
                            alt=""
                            height="200px"
                            className="mt-5"
                          />
                          <h1 className="mt-4">Not found...</h1>
                        </div>
                      )}
                      </div>
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
