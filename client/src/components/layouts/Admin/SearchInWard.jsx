import axios from "axios";
import React, { Component } from "react";
import "../../../assets/search-emp/searchEmp.css";
import { createHashHistory } from 'history'
export const history = createHashHistory()

export default class SearchInWard extends Component {
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
      doi: "",
      dopCheck: false,
    };
  }

  componentDidMount = async () => {
    const branchList = await axios.get("/api/admin/getBranchList");
    const updatedData = [...this.state.branchList, ...branchList.data];
    const inwardList = await axios.get("/api/admin/getInWardList");
    const smart_phones = this.state.smart_phones;
    const feature_phones = this.state.feature_phones;
    const accessories = this.state.accessories;
    inwardList.data.map(async (data) => {
      if(data.category === 'Smart Phone') {
        smart_phones.push(data.name)
      }
      if(data.category === 'Featured Phone') {
        feature_phones.push(data.name)
      }
      if(data.category === 'Accessories') {
        accessories.push(data.name)
      }
    });

    this.setState({
      branchList: updatedData,
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
    history.push('/addInWard');
  }


  onSubmit = async (e) => {
    e.preventDefault();

    let { name, doi, smart_phone, branch, feature_phone, accessory } = this.state;

    try {
      const res = await axios.post("/api/admin/searchInward", {
        name,
        doi,
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
        <h3>InWard List</h3>
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
                  name="doi"
                  type="date"
                  id="doi"
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
