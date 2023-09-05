import axios from "axios";
import React, { Component } from "react";
import "../../../assets/search-emp/searchEmp.css";
import { createHashHistory } from 'history'
export const history = createHashHistory()

export default class SearchSale extends Component {
  constructor() {
    super();

    this.state = {
      smart_phones: ["All", "None"],
      feature_phones: ["All", "None"],
      accessories: ["All", "None"],
      smart_phone: 'All',
      feature_phone: 'All',
      accessory: 'All',
      branch: 'All',
      branchList: [],
      categoryList: [],
      name: "",
      dos: "",
      dopCheck: false,
      type: this.props !== undefined && this.props.type ? this.props.type : "",
    };
  }

  componentDidMount = async () => {
    const branchList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getBranchList");
    const updatedData = [...this.state.branchList, ...branchList.data];
    const salesList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSalesList?type="+ this.props.type);
    const categoryList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getCategoryList");

    this.setState({
      branchList: updatedData,
      salesList: salesList.data,
      categoryList: categoryList.data
    });
  };

  onBranchSelect = (branch) => this.setState({ branch });

  onCategorySelect = (category) => {
    this.setState({ category });
  }

  toggleDateRange = () => this.setState({ dopCheck: !this.state.dopCheck });

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onClickAdd = (e) => {
    e.preventDefault();
    history.push('/addSales/' + this.props.type);
  }

  onSubmit = async (e) => {
    e.preventDefault();

    let { name, dos, category, branch } = this.state;

    try {
      const res = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/searchSale", {
        name,
        dos,
        branch, 
        category, 
        type: this.props.type
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
        {
          this.props.type === 'wgst' && 
          <h3>Sales Bill With GST</h3>
        }
        {
          this.props.type === 'wost' && 
          <h3>Sales Bill Wihout GST</h3>
        }
        {
          this.props.type === 'return' && 
          <h3>Sales Bill return</h3>
        }
        <form onSubmit={this.onSubmit}>
          <div className="row mt-3 px-3">
          <div className="col">
              <label htmlFor="team">Branch</label>
              <select className="form-control"
            value={this.state.branch}
            onChange={(e) =>
                      this.onBranchSelect(e.target.value)
                    }>
            <option value={"All"}>All</option>
            {this.state.branchList.map((data) => (
                <option value={data.name}>{data.name}</option>
            ))
            }
            <option value={"None"}>None</option>
            </select>
            </div>
            <div className="col">
            <label htmlFor="name">Category</label>
            <select className="form-control"
            value={this.state.category}
            onChange={(e) =>
                      this.onCategorySelect(e.target.value)
                    }>
            <option value={"All"}>All</option>
            {this.state.categoryList.map((data) => (
                <option value={data.name}>{data.name}</option>
            ))
            }
            <option value={"None"}>None</option>
            </select>
            </div>
            <div className="col">
              <label htmlFor="doj">Search</label>
              <div className="form-group">
                <input
                  placeholder="Enter text"
                  name="name"
                  type="text"
                  id="name"
                  className="form-control"
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div className="col">
              <label htmlFor="doj">Date</label>
              <div className="form-group">
                <input
                  placeholder="Date"
                  name="dos"
                  type="date"
                  id="dos"
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
                <br/>
                <button className="btn btn-primary" onClick={this.onClickAdd} style={{marginTop: '12px'}}>
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
