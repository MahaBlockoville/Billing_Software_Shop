import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../../context";
import AdminSidePanel from "../AdminSidePanel";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../../assets/images/noEmp.png";
import SearchInWard from "../SearchInWard";
import InWardCard from "../InWardCard";

export default class ViewInWards extends Component {
  constructor() {
    super();

    this.state = {
      inwardList: [],
      loading: true,
    };
  }

  componentDidMount = async () => {
    const inwardList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getInWardList");
    console.log("List: ", inwardList.data);
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
                        <SearchInWard onFilter={this.onFilter} />
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
                            <InWardCard inwardList={this.state.inwardList}  />
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
                          <h1 className="mt-4">No Employees found...</h1>
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
