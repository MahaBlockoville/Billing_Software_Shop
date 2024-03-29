import axios from "axios";
import React, { Component } from "react";
import "../../../assets/search-emp/searchEmp.css";
import { createHashHistory } from 'history'
export const history = createHashHistory()

export default class SearchEmp extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      role: "",
      email: "",
      team: "",
      doj: "",
      dojCheck: false,
    };
  }

  toggleDateRange = () => this.setState({ dojCheck: !this.state.dojCheck });

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e) => {
    e.preventDefault();

    let { name, role, branch, email, doj } = this.state;

    try {
      const res = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/search", {
        name,
        role,
        branch,
        email,
        doj,
      });

      this.props.onFilter(res.data);
      console.log(res.data);
    } catch (err) {
      console.log("Error: ", err.response.data);
    }
  };

  render() {
    return (
      <div className="container mt-3">
        <h3>Employee List</h3>
        <form onSubmit={this.onSubmit}>
          <div className="row mt-3 px-3">
            <div className="col">
              <label htmlFor="name">Employee Name</label>
              <div className="form-group">
                <input
                  name="name"
                  placeholder="Employee Name"
                  type="text"
                  id="name"
                  className="form-control"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div className="col">
              <label htmlFor="role">Role</label>
              <div className="form-group">
                <input
                  placeholder="Enter role"
                  name="role"
                  type="text"
                  id="role"
                  className="form-control mb-3 mb-3"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div className="col">
              <label htmlFor="email">Email</label>
              <div className="form-group">
                <input
                  placeholder="Enter email"
                  name="email"
                  type="email"
                  id="email"
                  className="form-control mb-3"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div className="col">
              <label htmlFor="team">Branch</label>
              <div className="form-group">
                <input
                  placeholder="Enter branch"
                  name="branch"
                  type="text"
                  id="branch"
                  className="form-control mb-3"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div className="col">
              <label htmlFor="doj">Date Of Joining</label>
              <div className="form-group">
                <input
                  placeholder="Date"
                  name="doj"
                  type="date"
                  id="doj"
                  className="form-control"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div
              className="col"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="form-group m-0 p-0">
                <button className="btn btn-primary">
                  <i
                    className="fas fa-search p-2"
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
