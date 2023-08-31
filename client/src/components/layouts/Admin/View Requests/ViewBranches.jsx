import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../../context";
import AdminSidePanel from "../AdminSidePanel";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../../assets/images/noEmp.png";
import SearchBranch from "../SearchBranch";
import BranchCard from "../BranchCard";

export default class ViewBranches extends Component {
  constructor() {
    super();

    this.state = {
      branchList: [],
      loading: true,
    };
  }

  componentDidMount = async () => {
    const branchList = await axios.get("/api/admin/getBranchList");
    console.log("List: ", branchList.data);
    this.setState({
      branchList: branchList.data,
      loading: false,
    });
  };

  // to filter data according to search criteria
  onFilter = (branchList) => {
    this.setState({ branchList });
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
                        <SearchBranch onFilter={this.onFilter} />
                      </div>

                      <hr />

                      {/* branch list */}
                      {this.state.loading ? (
                        <h1 className="text-center">Loading...</h1>
                      ) : this.state.branchList.length ? (
                        <div className="container">
                          <div
                            className="row"
                            style={{
                              display: "flex",
                            }}
                          >
                            {this.state.branchList.map((branch, index) => {
                              return <BranchCard key={index} data={branch} />;
                            })}
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
