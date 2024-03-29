import React, { Component } from "react";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../../assets/add-branch/addBranch.css";
import AdminSidePanel from "../Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddBranch extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      address: "",
      phoneNo: "",
      gst_number: "",
      dop: "",
      disabled: false,
      password: "",
      passwordCheck: "",
      // error
      error: "",
      password1Check: false,
      password2Check: false,
    };
  }

  componentDidMount = async () => {
    const teamAndRoleList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getTeamsAndRoles");
    console.log(teamAndRoleList.data[0]);

    this.setState({
      teamList: teamAndRoleList.data[0].teamNames,
      roleList: teamAndRoleList.data[0].roleNames,
    });
  };

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      name,
      address,
      phoneNo,
      dop,
      gst_number,
      password, passwordCheck
    } = this.state;

    try {

      const email = name + '@gmail.com';
      await axios.post(process.env.REACT_APP_API_URL +"/api/admin/register", {
        email,
        password,
        passwordCheck,
        name,
        role: 'branch'
      });

      const newUser = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/addBranch", {
        name,
        address,
        phoneNo,
        dop,
        gst_number
      });

      toast.notify("Added new branch", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/viewBranches`);
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

  onChange = (e) => {
    const { name } = e.target;
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (name === "password") {
        if (this.state.password.length >= 6) {
          this.setState({ password1Check: true });
        } else this.setState({ password1Check: false });
      } else if (name === "passwordCheck") {
        if (this.state.password === this.state.passwordCheck) {
          this.setState({ password2Check: true });
        } else this.setState({ password2Check: false });
      }
    });
  };

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/viewBranches');
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
                            <h3 className="">ADD BRANCH</h3>
                            <hr />

                            <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Branch Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Branch Name"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>

                              
                              {/* password */}
                              <div className="row">
                                <div className="col-sm-6 mx-auto">
                                <label htmlFor="name">Password</label>

                                  <input
                                    name="password"
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Password"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                              </div>

                              {/* re-enter password */}
                              <div className="row">
                                <div className="col-sm-6 mx-auto">
                                <label htmlFor="name">Re-Enter Password</label>
                                  <input
                                    name="passwordCheck"
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Re-enter password"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                              </div>

                            <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* address */}
                                <label htmlFor="address">Address</label>
                                <textarea
                                  name="address"
                                  id="address"
                                  // cols="20"
                                  rows="1"
                                  className="form-control mb-3 "
                                  placeholder="Address"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* phone no */}
                                <label htmlFor="phoneNo">Phone No.</label>
                                <input
                                  type="number"
                                  name="phoneNo"
                                  className="form-control mb-3 "
                                  placeholder="1234567890"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              {/* dop */}
                              <div className="col-sm-6 mx-auto">
                                <label htmlFor="dop">Date Of Opening</label>
                                <input
                                  type="date"
                                  name="dop"
                                  className="form-control mb-3 "
                                  placeholder="dop"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">
                              {/* dop */}
                              <div className="col-sm-6 mx-auto">
                                <label htmlFor="dop">Gst Number</label>
                                <input
                                  type="text"
                                  name="gst_number"
                                  className="form-control mb-3 "
                                  placeholder="GST Number"
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
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

export default AddBranch;
