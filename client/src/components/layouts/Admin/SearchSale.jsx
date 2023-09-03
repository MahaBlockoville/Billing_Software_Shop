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
      branchList: [{name: "All"}],
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
    this.setState({
      branchList: updatedData,
      salesList: salesList.data,
    });
  };

  onBranchSelect = (branch) => this.setState({ branch });

  onSmartPhoneSelect = (smart_phone) => this.setState({ smart_phone });

  onFeaturePhoneSelect = (feature_phone) => this.setState({ feature_phone });

  onAccessorySelect = (accessory) => this.setState({ accessory });

  toggleDateRange = () => this.setState({ dopCheck: !this.state.dopCheck });

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onClickAdd = (e) => {
    e.preventDefault();
    history.push('/addSales/' + this.props.type);
  }

  onSubmit = async (e) => {
    e.preventDefault();

    let { name, dos, smart_phone, branch, feature_phone, accessory } = this.state;

    try {
      const res = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/searchSale", {
        name,
        dos,
        smart_phone, 
        branch, 
        feature_phone, 
        accessory
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
                      onClick={() => this.onBranchSelect(data.name)}
                    >
                      {data.name}
                    </li>
                  ))}
                </div>
              </div>
            </div>
            <div className="col">
              <label htmlFor="team">Smart Phone</label>
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.state.smart_phone}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {this.state.smart_phones.map((data) => (
                    <li
                      style={{ cursor: "pointer" }}
                      key={data}
                      className="dropdown-item"
                      onClick={() => this.onSmartPhoneSelect(data)}
                    >
                      {data}
                    </li>
                  ))}
                </div>
              </div>
            </div>
            <div className="col">
              <label htmlFor="team">Featured Phone</label>
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.state.feature_phone}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {this.state.feature_phones.map((data) => (
                    <li
                      style={{ cursor: "pointer" }}
                      key={data}
                      className="dropdown-item"
                      onClick={() => this.onFeaturePhoneSelect(data)}
                    >
                      {data}
                    </li>
                  ))}
                </div>
              </div>
            </div>
            <div className="col">
              <label htmlFor="team">Accessories</label>
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.state.accessory}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {this.state.accessories.map((data) => (
                    <li
                      style={{ cursor: "pointer" }}
                      key={data}
                      className="dropdown-item"
                      onClick={() => this.onAccessorySelect(data)}
                    >
                      {data}
                    </li>
                  ))}
                </div>
              </div>
            </div>
            <div className="col">
              <label htmlFor="name">Search</label>
              <div className="form-group">
                <input
                  name="name"
                  placeholder="Type here..."
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
