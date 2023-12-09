import axios from "axios";
import React, { Component } from "react";
import "../../../assets/search-emp/searchEmp.css";
import { createHashHistory } from 'history'
export const history = createHashHistory()

export default class SearchProduct extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onClickAdd = (e) => {
    e.preventDefault();
    history.push('/addProduct');
  }

  onSubmit = async (e) => {
    e.preventDefault();

    let { name } = this.state;

    try {
      const res = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/searchProduct", {
        name,
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
          <h3>Product List</h3>
          <div className="row mt-3 px-3">
            <div className="col">
              <label htmlFor="name">Name</label>
              <div className="form-group">
                <input
                  name="name"
                  placeholder="Name"
                  type="text"
                  id="name"
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
