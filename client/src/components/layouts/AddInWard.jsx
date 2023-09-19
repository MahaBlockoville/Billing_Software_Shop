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
      imei_number: [],
      purchase_value: "",
      selling_value: "",
      initial_purchase_value: "",
      initial_selling_value: "",
      gst_percentage: "",
      reference_invoice_number: "",
      doi: "",
      quantity: "",
      branch: "Select Branch",
      product: "",
      branchList: [],
      productList: [],
      imeiNumberList: [],
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
      purchase_value: currentProduct[0].purchase_value,
      initial_purchase_value: currentProduct[0].purchase_value,
      initial_selling_value: currentProduct[0].selling_value,
      selling_value: currentProduct[0].selling_value,
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
      quantity,
      reference_invoice_number
    } = this.state;
    console.log(branch, 'branch')
   if (branch === "Select Branch") {
      this.setState({
        error: "Branch is required",
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
            purchase_value: parseInt(purchase_value)/parseInt(quantity),
            selling_value: parseInt(selling_value)/parseInt(quantity),
            gst_percentage,
            branch,
            product,
            doi,
            type,
            quantity,
            reference_invoice_number
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

  onQuantityChange = (e) => {
    console.log(`onQuantityChange`, e.target.value);
    if(e.target.value === '') {
      this.setState({
        purchase_value: this.state.initial_purchase_value,
        selling_value: this.state.initial_selling_value,
      });
    } else {
      const imeiNumberList = [];
      for(let i = e.target.value - 1; i >= 0; i--) {
        imeiNumberList.push(i);
      }
      this.setState({ 
        [e.target.name]: e.target.value,
        purchase_value: this.state.purchase_value * e.target.value,
        selling_value: this.state.selling_value * e.target.value,
        imeiNumberList: imeiNumberList
      });
    }
  }

  onNumberChange = (i, e) => {
    const temp = this.state.imei_number;
    const val = e.target.value;
    temp[i] = val;
    this.setState({
      imei_number: temp,
    });
  };

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
                              <div className="col">
                                  {/* email */}
                                  <label htmlFor="quantity">
                                  Quantity
                                  </label>
                                  <input
                                    type="number"
                                    name="quantity"
                                    className="form-control mb-3 "
                                    placeholder="Quantity"
                                    onChange={this.onQuantityChange}
                                    required
                                  />
                                </div>
                            </div>
                            <div className="row">
                            {this.state.category !== "Accessories" ? (
                                this.state.imeiNumberList.map((data) => {
                                  return <div className="col">
                                  <label htmlFor="imei_number">
                                    IMEI Number
                                  </label>
                                  <input
                                    type="number"
                                    name="imei_number"
                                    value={this.state.imei_number[data]}
                                    className="form-control mb-3 "
                                    placeholder="IMEI Number"
                                    onChange={(e) => this.onNumberChange(data, e)}
                                    required
                                  />
                                </div>
                                })
                              ) : (
                                this.state.imeiNumberList.map((data) => {
                                  return <div className="col">
                                  <label htmlFor="imei_number">
                                    Serial Number
                                  </label>
                                  <input
                                    type="number"
                                    name="imei_number"
                                    value={this.state.imei_number[data]}
                                    className="form-control mb-3 "
                                    placeholder="Serial Number"
                                    onChange={(e) => this.onNumberChange(data, e)}
                                    required
                                  />
                                </div>
                                })
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
                              <div className="col">
                                <label htmlFor="reference_invoice_number">
                                Reference Invoice Number
                                </label>
                                <input
                                  type="number"
                                  name="reference_invoice_number"
                                  value={this.state.reference_invoice_number}
                                  className="form-control mb-3 "
                                  placeholder="Reference Invoice Number"
                                  onChange={this.onChange}
                                />
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
                                  value={this.state.purchase_value}
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
                                  value={this.state.selling_value}
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
