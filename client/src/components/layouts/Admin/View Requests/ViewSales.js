import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../../context";
import AdminSidePanel from "../AdminSidePanel";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../../assets/images/noEmp.png";
import SearchSale from "../SearchSale";
import SaleCard from "../SaleCard";

export default class ViewSales extends Component {
  constructor() {
    super();

    this.state = {
      salesList: [],
      loading: true,
    };
  }

  componentDidMount = async () => {
    const salesList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSalesList");
    console.log("List: ", salesList.data);
    this.setState({
      salesList: salesList.data,
      loading: false,
    });
  };

  // to filter data according to search criteria
  onFilter = (salesList) => {
    this.setState({ salesList });
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
                      <div className="row">
                        <SearchSale onFilter={this.onFilter} />
                      </div>

                      {/* branch list */}
                      {this.state.loading ? (
                        <h1 className="text-center">Loading...</h1>
                      ) : this.state.salesList.length ? (
                        <div className="container">
                          <div
                            className="row"
                            style={{
                              display: "flex",
                            }}
                          >
                          <SaleCard salesList={this.state.salesList}  />
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
                </>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
