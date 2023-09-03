import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import AdminSidePanel from "./AdminSidePanel";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../assets/images/noEmp.png";
import SearchStockReport from "./SearchStockReport";
import { MDBDataTable } from "mdbreact";

export default class StockReport extends Component {
  constructor() {
    super();

    this.state = {
      inwardList: [],
      type: '',
      loading: true,
    };
  }

  componentDidMount = async () => {
    const inwardList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getInWardList");
    console.log("List: ", inwardList.data);
    inwardList.data.map(async (item) => { 
        item.name = item.product.name;
        item.color = item.product.color;
        item.variant = item.product.variant;
        item.model = item.product.model;
    })
    this.setState({
      inwardList: inwardList.data,
      loading: false,
    });
  };
  // to filter data according to search criteria
  onFilter = (inwardList) => {
    this.setState({ inwardList });
  };

  render() {
    const data = {
        columns: [
          {
            label: 'Brand Name',
            field: 'name',
            sort: 'asc',
            width: 150
          },
          {
            label: 'IMEI/Serial Number',
            field: 'imei_number',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Variant',
            field: 'variant',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Model',
            field: 'model',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Color',
            field: 'color',
            sort: 'asc',
            width: 100
          },
          {
            label: 'GST',
            field: 'gst_percentage',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Purchase Value',
            field: 'purchase_value',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Selling Value',
            field: 'selling_value',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Type',
            field: 'type',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Date',
            field: 'doi',
            sort: 'asc',
            width: 150
          },
        ],
        rows: this.state.inwardList
      }
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
                        <SearchStockReport onFilter={this.onFilter} />
                      </div>

                      {/* branch list */}
                      {this.state.loading ? (
                        <h1 className="text-center">Loading...</h1>
                      ) : this.state.inwardList.length ? (
                        <div className="container">
                          <div
                            className="row"
                            style={{
                              display: "flex",
                            }}
                          >
                            <MDBDataTable
                            striped
                            bordered
                            small
                            hover
                            exportToCSV
                            data={data}
                            />
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
                          <h1 className="mt-4">No InWard found...</h1>
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
