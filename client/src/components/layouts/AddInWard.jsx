import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/add-emp/addEmp.css";
import AdminSidePanel from "./Admin/AdminSidePanel";
import Select from "react-select";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddInWard extends Component {
  constructor() {
    super();

    this.state = {
      categories: [],
      disabled: false,
      name: "",
      imei_number: "",
      purchase_value: "",
      selling_value: "",
      gst_percentage: "",
      doi: "",
      branch: "Select Branch",
      product: "",
      branchList: [],
      productList: [],
      selectionOption: {},
      location: "",
      options: [],
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const type = this.props.match.params.type;
    this.setState({ type: type });
    const branchList = await axios.get(
      process.env.REACT_APP_API_URL + "/api/admin/getBranchList"
    );
    const productList = await axios.get(
      process.env.REACT_APP_API_URL + "/api/admin/getProductList"
    );
    const options = [];
    productList.data.map(async (data) => {
      options.push({
        value: data._id,
        label:
          data.name +
          " - " +
          data.model +
          " - " +
          data.variant +
          " - " +
          data.color,
      });
    });
    this.setState({
      options: options,
      branchList: branchList.data,
      productList: productList.data,
    });
  };

  onBranchSelect = (branch) => this.setState({ branch });

  onProductSelect = (product_id) => {
    const currentProduct = this.state.productList.filter(
      (product) => product_id === product._id
    );
    console.log(
      currentProduct,
      "currentProduct",
      this.state.productList,
      product_id
    );
    this.setState({
      product: product_id,
      name: currentProduct[0].name,
      model: currentProduct[0].model,
      variant: currentProduct[0].variant,
      color: currentProduct[0].color,
      category: currentProduct[0].category.name,
      selectionOption: {
        value: product_id,
        label:
          currentProduct[0].name +
          " - " +
          currentProduct[0].model +
          " - " +
          currentProduct[0].variant +
          " - " +
          currentProduct[0].color,
      },
    });
  };

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    const {
      imei_number,
      purchase_value,
      selling_value,
      gst_percentage,
      branch,
      product,
      doi,
      type,
    } = this.state;
   if (imei_number.length > 20 || imei_number.length < 15) {
      this.setState({
        error: "IMEI number must be with in 15 to 20 characters",
      });
    } else {
      // disable signup btn
      this.setState({
        disabled: true,
      });
      try {
        const newUser = await axios.post(
          process.env.REACT_APP_API_URL + "/api/admin/addInWard",
          {
            imei_number,
            purchase_value,
            selling_value,
            gst_percentage,
            branch,
            product,
            doi,
            type,
          }
        );

        toast.notify("Added new item", {
          position: "top-right",
        });

        console.log("created acc successfully: ", newUser.data);
        this.props.history.push(`/viewInWards/${type}`);
      } catch (err) {
        // enable signup btn
        this.setState({
          disabled: false,
        });

        console.log("ERROR: ", err.response.data.msg);
        this.setState({ error: err.response.data.msg });
      }
    }
  };

  onCategorySelect = (category) => this.setState({ category });

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push("/viewInWards/" + this.state.type);
  };

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
                                <label className="product">Product</label>
                                <Select
                                  value={this.state.selectionOption}
                                  options={this.state.options}
                                  onChange={(e) =>
                                    this.onProductSelect(e.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <label htmlFor="category">Category</label>
                                <input
                                  type="text"
                                  name="category"
                                  className="form-control mb-3 "
                                  value={this.state.category}
                                  placeholder="Category"
                                  onChange={this.onChange}
                                  readOnly={true}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                {/* name */}
                                <label htmlFor="name">Brand</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.name}
                                  className="form-control"
                                  placeholder="Brand"
                                  onChange={this.onChange}
                                  readOnly={true}
                                  required
                                />
                              </div>
                              {this.state.category !== "Accessories" ? (
                                <div className="col">
                                  {/* email */}
                                  <label htmlFor="imei_number">
                                    IMEI Number
                                  </label>
                                  <input
                                    type="number"
                                    name="imei_number"
                                    className="form-control mb-3 "
                                    placeholder="IMEI Number"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                              ) : (
                                <div className="col">
                                  {/* email */}
                                  <label htmlFor="imei_number">
                                    Serial Number
                                  </label>
                                  <input
                                    type="number"
                                    name="imei_number"
                                    className="form-control mb-3 "
                                    placeholder="Serial Number"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                              )}
                            </div>
                            <div className="row">
                              <div className="col">
                                {/* model */}
                                <label htmlFor="model">Model</label>
                                <textarea
                                  name="model"
                                  id="model"
                                  // cols="20"
                                  value={this.state.model}
                                  rows="1"
                                  className="form-control mb-3 "
                                  placeholder="Model"
                                  onChange={this.onChange}
                                  readOnly={true}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* phone no */}
                                <label htmlFor="variant">Variant</label>
                                <input
                                  type="text"
                                  name="variant"
                                  value={this.state.variant}
                                  className="form-control mb-3 "
                                  placeholder="Variant"
                                  onChange={this.onChange}
                                  readOnly={true}
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
                              {this.state.type === "firstPurchase" && (
                                <div className="col">
                                  <label htmlFor="gst_percentage">
                                    GST Percentage
                                  </label>
                                  <input
                                    type="number"
                                    name="gst_percentage"
                                    className="form-control mb-3 "
                                    placeholder="GST Percentage"
                                    onChange={this.onChange}
                                  />
                                </div>
                              )}
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
                                  value={this.state.color}
                                  className="form-control mb-3 "
                                  placeholder="color"
                                  onChange={this.onChange}
                                  readOnly={true}
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
                            <br />
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

export default AddInWard;
