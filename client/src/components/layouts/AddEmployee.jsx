import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/add-emp/addEmp.css";
import AdminSidePanel from "./Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddEmployee extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      name: "",
      address: "",
      phoneNo: "",
      role: "Select Role",
      team: "Select Team",
      branch: "Select Branch",
      gender: "Select Gender",
      doj: "",
      disabled: false,

      // error
      error: "",

      // teams and roels
      branchList: [],
      teamList: [],
      roleList: [],
    };
  }

  componentDidMount = async () => {
    const teamAndRoleList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getTeamsAndRoles");
    const branchList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getBranchList");
    this.setState({
      branchList: branchList.data,
      teamList: teamAndRoleList.data[0].teamNames,
      team: teamAndRoleList.data[0]?.teamNames[0],
      role: teamAndRoleList.data[0]?.roleNames[0],
      roleList: teamAndRoleList.data[0].roleNames,
    });
  };

  onSelectGender = (gender) => this.setState({ gender });

  onTeamSelect = (team) => this.setState({ team });

  onBranchSelect = (branch) => this.setState({ branch });

  onRoleSelect = (role) => this.setState({ role });

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      email,
      name,
      address,
      phoneNo,
      role,
      team,
      branch,
      doj,
      gender,
    } = this.state;

    try {
      const newUser = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/addEmployee", {
        email,
        name,
        address,
        gender,
        phoneNo,
        role,
        branch,
        team,
        doj,
      });

      toast.notify("Added new employee", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/viewEmployees`);
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/viewEmployees');
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
                        className="col"
                        style={{
                         // display: "flex ",
                          flexDirection: "row",
                          justifyContent: "center",
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
                            <h3 className="">ADD EMPLOYEE</h3>
                            <hr />

                            <div className="row">
                              <div className="col">
                                {/* name */}
                                <label htmlFor="name">Employee Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Employee name"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* email */}
                                <label htmlFor="email">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  className="form-control mb-3 "
                                  placeholder="Enter email"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                {/* address */}
                                <label htmlFor="address">Address</label>
                                <textarea
                                  name="address"
                                  id="address"
                                  // cols="20"
                                  rows="1"
                                  className="form-control mb-3 "
                                  placeholder="Enter address"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
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
                              {/* team */}
                              <div className="col">
                                <label htmlFor="team">Branch</label>
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
                              <div className="col">
                                <label htmlFor="role">Position</label>
                                <div className="dropdown mb-3">
                                  <button
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    {this.state.role}
                                  </button>
                                  <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton"
                                  >
                                    {this.state.roleList.map((roleName) => (
                                      <li
                                        style={{ cursor: "pointer" }}
                                        key={roleName}
                                        className="dropdown-item"
                                        onClick={() =>
                                          this.onRoleSelect(roleName)
                                        }
                                      >
                                        {roleName}
                                      </li>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              {/* doj */}
                              <div className="col">
                                <label htmlFor="doj">Date Of Joining</label>
                                <input
                                  type="date"
                                  name="doj"
                                  className="form-control mb-3 "
                                  placeholder="doj"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>

                              {/* gender */}
                              <div className="col">
                                <label>Gender</label>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    {this.state.gender}
                                  </button>
                                  <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton"
                                  >
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onSelectGender("Male")
                                      }
                                    >
                                      Male
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onSelectGender("Female")
                                      }
                                    >
                                      Female
                                    </li>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Submit"
                              className="btn btn-primary"
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;
                                <input
                                  onClick={this.onCancel}
                                  type="button"
                                  value="Back"
                                  className="btn btn-primary"
                                />
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

export default AddEmployee;
