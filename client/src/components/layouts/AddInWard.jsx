import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/add-emp/addEmp.css";
import AdminSidePanel from "./Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddInWard extends Component {
  constructor() {
    super();

    this.state = {
      categories: [{name: 'Smart Phone'}, {name: 'Featured Phone'}, {name: 'Accessories'}],
      category: "Select Category",
      disabled: false,
      name: '',
    imei_number: '', 
    model: '', 
    variant: '', 
    color: '', 
    purchase_value: '', 
    selling_value: '', 
    discount: '',
    doi: '', 
    branch: 'Select Branch', 
    branchList: [],
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const branchList = await axios.get("/api/admin/getBranchList");
    this.setState({
      branchList: branchList.data,
    });
  };
  onBranchSelect = (branch) => this.setState({ branch });
  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
        name, imei_number, model, variant, color, purchase_value, selling_value, 
        discount, branch, category, doi
    } = this.state;

    try {
      const newUser = await axios.post("/api/admin/addInWard", {
        name, imei_number, model, variant, color, purchase_value, selling_value, 
        discount, branch, category, doi
      });

      toast.notify("Added new item", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/viewInWards`);
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onCategorySelect = (category) => this.setState({ category });


  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user, dispatch, token } = value;
          if (token === undefined) token = "";

          if (token) {
            if (user.role !== "admin") return <Redirect to="/" />;
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
                          //display: "flex ",
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
                            <h3 className="">IN WARD</h3>
                            <hr />

                            <div className="row">
                              <div className="col">
                              <label htmlFor="category">Category</label>
                              <div className="dropdown">
                                  <button
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    {this.state.category}
                                  </button>
                                  <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton"
                                  >
                                    {this.state.categories.map((data) => (
                                      <li
                                        style={{ cursor: "pointer" }}
                                        key={data.name}
                                        className="dropdown-item"
                                        onClick={() =>
                                          this.onCategorySelect(data.name)
                                        }
                                      >
                                        {data.name}
                                      </li>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {this.state.category !== "Select Category" && 
                            <>
                            <div className="row">
                              <div className="col">
                                {/* name */}
                                <label htmlFor="name">Brand</label>
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Brand"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* email */}
                                <label htmlFor="imei_number">IMEI Number</label>
                                <input
                                  type="number"
                                  name="imei_number"
                                  className="form-control mb-3 "
                                  placeholder="IMEI Number"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                {/* model */}
                                <label htmlFor="model">Model</label>
                                <textarea
                                  name="model"
                                  id="model"
                                  // cols="20"
                                  rows="1"
                                  className="form-control mb-3 "
                                  placeholder="Model"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* phone no */}
                                <label htmlFor="variant">Variant</label>
                                <input
                                  type="text"
                                  name="variant"
                                  className="form-control mb-3 "
                                  placeholder="Variant"
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
                                <label htmlFor="discount">Discount</label>
                                <input
                                  type="number"
                                  name="discount"
                                  className="form-control mb-3 "
                                  placeholder="Discount"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                            <div className="col-md-6">

                              {/* doj */}
                                <label htmlFor="doj">Date Of In Ward</label>
                                <input
                                  type="date"
                                  name="doi"
                                  className="form-control mb-3 "
                                  placeholder="doi"
                                  onChange={this.onChange}
                                  required
                                />
                                </div>
                                <div className="col-md-6">
                                <label htmlFor="doj">Color</label>
                                <input
                                  type="text"
                                  name="color"
                                  className="form-control mb-3 "
                                  placeholder="color"
                                  onChange={this.onChange}
                                  required
                                />
                                </div>
                            </div>
                            <div className="row">
                            {/* gender */}
                              <div className="col">
                                <label>Purchase Value</label>
                                <input
                                  type="number"
                                  name="purchase_value"
                                  className="form-control mb-3 "
                                  placeholder="Type purchase value"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                <label>Selling Value</label>
                                <input
                                  type="number"
                                  name="selling_value"
                                  className="form-control mb-3 "
                                  placeholder="Type selling value"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>
                            </>}
                            <br />
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Submit"
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

export default AddInWard;
