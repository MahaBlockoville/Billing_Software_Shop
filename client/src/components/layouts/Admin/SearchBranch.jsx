import axios from "axios";
import React, { Component } from "react";
import "../../../assets/search-emp/searchEmp.css";
import { createHashHistory } from 'history'
export const history = createHashHistory()

export default class SearchBranch extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      dop: "",
      dopCheck: false,
    };
  }

  toggleDateRange = () => this.setState({ dopCheck: !this.state.dopCheck });

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onClickAdd = (e) => {
    e.preventDefault();
    history.push('/addBranch');
  }

  onSubmit = async (e) => {
    e.preventDefault();

    let { name, dop } = this.state;

    try {
      const res = await axios.post("/api/admin/searchBranch", {
        name,
        dop,
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
        <form onSubmit={this.onSubmit}>
          <h3>Branch List</h3>
          <div className="row mt-3 px-3">
            <div className="col">
              <label htmlFor="name">Name</label>
              <div className="form-group">
                <input
                  name="name"
                  placeholder="Joey Tribbiani"
                  type="text"
                  id="name"
                  className="form-control"
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div className="col">
              <label htmlFor="doj">Date Of Opening</label>
              <div className="form-group">
                <input
                  placeholder="Date"
                  name="dop"
                  type="date"
                  id="dop"
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
                &nbsp;&nbsp;
                <button className="btn btn-primary" onClick={this.onClickAdd}>
                  <i
                    className="fas fa-user-plus p-2"
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
