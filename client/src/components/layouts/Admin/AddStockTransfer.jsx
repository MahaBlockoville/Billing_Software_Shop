import React, { Component } from "react";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../../assets/add-branch/addBranch.css";
import AdminSidePanel from "./AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddStockTransfer extends Component {
  constructor() {
    super();

    this.state = {
      inward_id: "",
      branchList: [],
      branch: "",
      type: "",
      from_branch: "",
      disabled: false,
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const inWardId = this.props.match.params.id;
    const branchList = await axios.get(
      process.env.REACT_APP_API_URL + "/api/admin/getBranchList"
    );
    const inWardData = await axios.get(
      process.env.REACT_APP_API_URL + `/api/admin/getInWardData/${inWardId}`
    );
    this.setState({
      inward_id: inWardId,
      branchList: branchList.data,
      from_branch: inWardData.data.branch,
      type: inWardData.data.type,
    });
  };

  onBranchSelect = (branch) => this.setState({ branch });

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      inward_id,
      branch,
    } = this.state;

    try {
      const newUser = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/updateStockTransfer", {
        inward_id, branch
      });

      toast.notify("Added new stock transfer", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/viewInWards/${newUser.data.type}`);

    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      alert(err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push(`/viewInWards/` + this.state.type);
  }

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user, dispatch, token } = value;
          if (token === undefined) token = "";

          if (token) {
            if (user.role !== "admin"  && user.role !== 'branch') return <Redirect to="/" />;
            return (
              <Spring
                // from={{ opacity: 0 }}
                // to={{ opacity: 1 }}
                // config={{ duration: 300 }}

                from={{
                  transform: "translate3d(1000px,0,0) ",
                }}
                to={{
                  transform: "translate3d(0px,0,0) ",
                }}
                config={{ friction: 20 }}
              >
                {(props) => (
                  <>
                    <div className="row m-0">
                      {/* left part */}
                      <div className="col-2  p-0 leftPart">
                        <AdminSidePanel />
                      </div>

                      {/* right part */}
                      <div
                        className="col-md-6"
                        style={{
                          //display: "flex ",
                          flexDirection: "row",
                          justifyContent: "center",
                          marginRight: '350px',
                        }}
                      >
                        <div style={props}>
                          {this.state.error ? (
                            <div className="alert alert-danger my-3">
                              {this.state.error}
                            </div>
                          ) : null}

                          <form
                            className="addEmpForm"
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                          >
                            <h3 className="">Add Stock Transfer</h3>
                            <hr />

                            <div className="row">
                            <div className="row">
                              {/* team */}
                              <div className="col">
                                {/* phone no */}
                                <label htmlFor="branch">Stock Branch(From)</label>
                                <input
                                  type="text"
                                  name="branch"
                                  value={this.state.from_branch}
                                  className="form-control mb-3 "
                                  placeholder="Branch"
                                  readOnly={true}
                                  required
                                />
                              </div>
                                <div className="col">
                                  <label htmlFor="team">Transfer Branch(To)</label>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-light dropdown-toggle"
                                      type="button"
                                      id="dropdownMenuButton"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      {this.state.branch}
                                    </button>
                                    <div
                                      className="dropdown-menu"
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      {this.state.branchList.map((data) => (
                                        <li
                                          style={{ cursor: "pointer" }}
                                          key={data._id}
                                          className="dropdown-item"
                                          onClick={() =>
                                            this.onBranchSelect(data.name)
                                          }
                                        >
                                          {data.name}
                                        </li>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                              
                              {/* role */}
                            </div>
                              </div>
                            <br/>
                            <div className="row">
                              {/* dop */}
                              <div className="col-sm-6 mx-auto">
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Submit"
                              className="btn btn-primary align-center"
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;
                                <input
                                  onClick={this.onCancel}
                                  type="button"
                                  value="Back"
                                  className="btn btn-primary"
                                />
                            </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Spring>
            );
          } else {
            return <Redirect to="/login" />;
          }
        }}
      </Consumer>
    );
  }
}

export default AddStockTransfer;
