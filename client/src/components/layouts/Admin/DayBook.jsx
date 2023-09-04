import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import AdminSidePanel from "./AdminSidePanel";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../assets/images/noEmp.png";
import "toasted-notes/src/styles.css";
import { createHashHistory } from "history";
export const history = createHashHistory();

//import "../../../assets/add-category/addCategory.css";

export default class DayBook extends Component {
  constructor() {
    super();

    this.state = {
      itemList: [],
      loading: true,
    };
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

  // to filter data according to search criteria
  onFilter = (itemList) => {
    this.setState({ itemList });
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
                    <div className="col " style={props}>
                    <h3>Day Book</h3>
                      <hr />

                      {/* branch list */}
                      {this.state.loading ? (
                        <h1 className="text-center">Loading...</h1>
                      ) : this.state.itemList.length ? (
                        <div className="container">
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
                          <h1 className="mt-4">No Category found...</h1>
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