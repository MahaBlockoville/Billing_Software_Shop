import React, { Component } from "react";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../../assets/add-branch/addBranch.css";
import AdminSidePanel from "./AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddExpense extends Component {
  constructor() {
    super();

    this.state = {
      brand: "",
      content: "",
      amount: "",
      expense: "",
      expenseList: [{name: "expense"}, {name: "scheme"}],
      doe: "",
      disabled: false,
      // error
      error: "",
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      brand,
      content,
      expense,
      doe,
      amount
    } = this.state;

    try {
      const newUser = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/addExpense", {
        brand,
        content,
        expense,
        doe,
        amount
      });

      toast.notify("Added new expense", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/payroll`);
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

  onExpenseSelect = (expense) => {
    this.setState({ expense });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/payroll');
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
                            <h3 className="">ADD EXPENSE</h3>
                            <hr />
                            <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Type</label>
                                <select className="form-control"
                                value={this.state.expense}
                               onChange={(e) =>
                                          this.onExpenseSelect(e.target.value)
                                        }>
                                <option>Select</option>
                                {this.state.expenseList.map((data) => (
                                    <option value={data.name}>{data.name}</option>
                                ))
                                }
                                </select>
                    
                              </div>
                              </div>
                                {
                                  this.state.expense === 'scheme' &&
                                  <div className="row">
                                  <div className="col-sm-6 mx-auto">
                                    {/* name */}
                                    <label htmlFor="name">Branch Name</label>
                                    <input
                                      type="text"
                                      name="brand"
                                      className="form-control"
                                      placeholder="Branch Name"
                                      onChange={this.onChange}
                                      required
                                    />
                                  </div>
                                  </div>
                                }
                            <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* content */}
                                <label htmlFor="content">Content</label>
                                <textarea
                                  name="content"
                                  id="content"
                                  // cols="20"
                                  rows="1"
                                  className="form-control mb-3 "
                                  placeholder="Content"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* phone no */}
                                <label htmlFor="amount">Amount.</label>
                                <input
                                  type="number"
                                  name="amount"
                                  className="form-control mb-3 "
                                  placeholder="Amount"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              {/* dop */}
                              <div className="col-sm-6 mx-auto">
                                <label htmlFor="doe">Date</label>
                                <input
                                  type="date"
                                  name="doe"
                                  className="form-control mb-3 "
                                  placeholder="doe"
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

export default AddExpense;
