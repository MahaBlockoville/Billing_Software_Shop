import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/add-branch/addBranch.css";
import AdminSidePanel from "./Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class UserProfile extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      disabled: false,
      password: "",
      passwordCheck: "",
      branch_user_id: "",
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const token = localStorage.getItem("auth-token");
    const tokenRes = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/tokenIsValid", null, {
      headers: { "x-auth-token": token },
    });
    if (tokenRes.data) {
      //logged in
      const adminRes = await axios.get(process.env.REACT_APP_API_URL +"/api/admin", {
        headers: { "x-auth-token": token },
      });
      console.log("admin profile: ", adminRes.data.user);
      this.setState({
        admin: adminRes.data.user,
      });
      
        const branchUser = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getBranchUser/${adminRes.data.user.name}`);
        this.setState({
          name: branchUser.data ? branchUser.data.name : '',
          branch_user_id: branchUser.data ? branchUser.data._id : '',
        });
    }
  };

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      name,
      branch_user_id,
      password,
      passwordCheck
    } = this.state;
   
    try {
        const email = name + '@gmail.com';
        if(branch_user_id) {
          await axios.post(process.env.REACT_APP_API_URL +"/api/admin/branchUserUpdate", {
            email,
            password,
            passwordCheck,
            branch_user_id,
            name,
          });
        } else {
          await axios.post(process.env.REACT_APP_API_URL +"/api/admin/register", {
            email,
            password,
            passwordCheck,
            name,
            role: 'branch'
          });
        }
      toast.notify("Updated new branch", {
        position: "top-right",
      });

      console.log("created acc successfully: ");
      this.props.history.push(`/`);
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
    this.props.history.push('/');
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
                            <h3 className="">EDIT MY INFO</h3>
                            <hr />

                            <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.name}
                                  className="form-control"
                                  placeholder="Name"
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

export default UserProfile;