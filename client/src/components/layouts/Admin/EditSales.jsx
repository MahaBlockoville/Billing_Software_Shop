import React, { Component } from "react";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../../assets/add-emp/addEmp.css";
import AdminSidePanel from "../Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
//import Select from "react-select";

class EditSales extends Component {
  constructor() {
    super();
    this.state = {
      payment_types: [{ name: "Cash" }, { name: "EMI" }],
      payment_type: "Select...",
      disabled: false,
      name: "",
      imeiNumberList: [],
      imei_number: "",
      phone: "",
      address: "",
      email: "",
      selling_value: "",
      tenure: "",
      dos: "",
      gst_number: "",
      gst_percentage: "",
      branch: "",
      branchList: [],
      inwardList: [],
      sales_person: "",
      empList: [],
      selectionOption: {},
      options: [],
      finance_name: "",
      order_no: "",
      is_same: false,
      shipping_address: "",
      shipping_name: "",
      shipping_email: "",
      shipping_phone: "",
      salesCount: "",
      oldProductList: [],
      productList: [
        {
          is_gift: false,
          selectionOption: {},
          imei_number: "",
          inward_id: "",
          category: "",
          branch: "",
          selling_value: "",
          gst_percentage: "",
          gst_number: "",
        },
      ],
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const branchList = await axios.get(
      process.env.REACT_APP_API_URL + "/api/admin/getBranchList"
    );

    const token = localStorage.getItem("auth-token");
    const tokenRes = await axios.post(
      process.env.REACT_APP_API_URL + "/api/admin/tokenIsValid",
      null,
      {
        headers: { "x-auth-token": token },
      }
    );
    if (tokenRes.data) {
      //logged in
      const adminRes = await axios.get(
        process.env.REACT_APP_API_URL + "/api/admin",
        {
          headers: { "x-auth-token": token },
        }
      );
      console.log("admin profile: ", adminRes.data.user);

      this.setState({
        admin: adminRes.data.user,
        branch: adminRes.data.user.name,
      });
    }

    const stock = ["firstPurchase", "secondPurchase"];
    const inwardList = await axios.get(
      process.env.REACT_APP_API_URL + "/api/admin/getInWardList?stock=" + stock
    );
    const saleId = this.props.match.params.id;
    this.setState({ sale_id: saleId });
    const salesData = await axios.get(
      process.env.REACT_APP_API_URL + `/api/admin/getSaleData/${saleId}`
    );
    console.log("salesData.data.selling_value", salesData.data.selling_value);
    const salesCount = await axios.get(
      process.env.REACT_APP_API_URL + `/api/admin/getSaleCount`
    );

    const imeiNumberList = this.state.imeiNumberList;
    inwardList.data.map(async (data) => {
      imeiNumberList.push(data.imei_number);
    });
    const options = [];
    inwardList.data.map(async (data) => {
      options.push({
        value: data.imei_number,
        label:
          data.product.name +
          " - " +
          data.product.model +
          " - " +
          data.product.variant +
          " - " +
          data.product.color +
          "-" +
          data.imei_number,
      });
    });
    const empList = await axios.get(
      process.env.REACT_APP_API_URL + "/api/admin/getEmpList"
    );
    const product_list = salesData.data.product_list.map(v => ({...v, is_gift: false}))

    this.setState({
      empList: empList.data,
      imeiNumberList: imeiNumberList,
      branchList: branchList.data,
      inwardList: inwardList.data,
      salesCount: salesCount.data,
      options: options,
      ...salesData.data,
      productList: product_list,
      oldProductList: product_list,
    });
  };
  onBranchSelect = (branch) => {
    console.log("onBranchSelect", branch);
    this.setState({ branch });
  };

  onPaymentSelect = (payment_type) => this.setState({ payment_type });

  onSubmit = async (dispatch, e) => {
    e.preventDefault();
    let {
      name,
      imei_number,
      phone,
      address,
      email,
      selling_value,
      tenure,
      branch,
      payment_type,
      dos,
      gst_number,
      gst_percentage,
      sale_id,
      sales_person,
      salesCount,
      productList,
      finance_name,
      order_no,
      shipping_address,
      shipping_name,
      shipping_email,
      shipping_phone,
    } = this.state;
    // disable signup btn
    this.setState({
      disabled: true,
    });
    try {
      const newUser = await axios.post(
        process.env.REACT_APP_API_URL + "/api/admin/addSale",
        {
          name,
          imei_number,
          phone,
          address,
          email,
          selling_value,
          tenure,
          branch,
          payment_type,
          dos,
          gst_number,
          gst_percentage,
          sale_id,
          sales_person,
          salesCount,
          productList,
          finance_name,
          order_no,
          shipping_address,
          shipping_name,
          shipping_email,
          shipping_phone,
        }
      );

      toast.notify("Added new item", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/viewSales/` + this.state.type);
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => {
    console.log("onChange", e.target);
    this.setState({ [e.target.name]: e.target.value });
  };

  onEmpSelect = (sales_person) => this.setState({ sales_person });

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push("/viewSales/" + this.state.type);
  };

  handleList = (index, field, value) => {
    if (field === "imei_number") {
      let updatedExtras = [...this.state.oldProductList];
      //updatedExtras[index]['is_gift'] = false;
      console.log('oldProductList after', updatedExtras)
      this.setState({
        productList: updatedExtras,
      });
    }
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user, dispatch, token } = value;
          if (token === undefined) token = "";

          if (token) {
            if (user.role !== "admin" && user.role !== "branch")
              return <Redirect to="/" />;
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
                            <h3 className="">Sales</h3>
                            <hr />
                            <div className="row">
                              <div className="col">
                                {/* name */}
                                <label htmlFor="name">Customer Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.name}
                                  className="form-control"
                                  placeholder="Name"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* model */}
                                <label htmlFor="model">Address</label>
                                <input
                                  type="text"
                                  name="address"
                                  value={this.state.address}
                                  className="form-control mb-3 "
                                  placeholder="Address"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* model */}
                                <label htmlFor="model">Phone</label>
                                <input
                                  type="number"
                                  name="phone"
                                  value={this.state.phone}
                                  className="form-control mb-3 "
                                  placeholder="Phone Number"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* phone no */}
                                <label htmlFor="variant">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={this.state.email}
                                  className="form-control mb-3 "
                                  placeholder="Email"
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                            <div className="row">
                              {/* team */}
                              <div className="col">
                                <label htmlFor="team">Sales Person</label>
                                <select
                                  className="form-control"
                                  value={this.state.sales_person}
                                  onChange={(e) =>
                                    this.onEmpSelect(e.target.value)
                                  }
                                >
                                  <option>Select</option>
                                  {this.state.empList.map((data) => (
                                    <option value={data.name}>
                                      {data.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col">
                                {/* dos */}
                                <label htmlFor="doj">Date Of Sale</label>
                                <input
                                  type="date"
                                  value={this.state.dos}
                                  name="dos"
                                  className="form-control mb-3 "
                                  placeholder="dos"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>

                              {/* role */}
                            </div>
                            <div className="locations">
                              {this.state.productList &&
                                Array.isArray(this.state.productList) &&
                                this.state.productList.map((data, i) => (
                                  <div className="my-2 mt-md-4" key={i}>
                                    <div className="row">
                                      <div className="col">
                                        <label htmlFor="team">
                                          IMEI/Serial Number
                                        </label>
                                        <input
                                          type="text"
                                          name="branch"
                                          className="form-control mb-3 "
                                          value={data.selectionOption.label}
                                          placeholder="Branch"
                                          readOnly={true}
                                        />
                                      </div>
                                      {
                                      data && data.imei_number &&  <div className="col">
                                      <label className="checkbox-holder">
                                        <input
                                          type="checkbox"
                                          name="is_information_saved"
                                          className="me-2 mt-4"
                                          checked={data.is_gift}
                                          onChange={(e) => {
                                            if(e.target.checked) {
                                              const updatedExtras = [...this.state.productList];
                                              updatedExtras[i]['is_gift'] = e.target.checked;
                                              updatedExtras[i]['selling_value'] = 0;
                                              updatedExtras[i]['gst_percentage'] = 0;
                                              this.setState({
                                                productList: updatedExtras,
                                              });
                                            }else {
                                              this.setState({ error: "Kindly try to do one option at a time" });
                                              this.props.history.push("/viewSales/" + this.state.type);
                                            }
                                          }
                                          }
                                        />
                                        {" "}Is Gift?
                                      </label>
                                    </div>
                                    }
                                      <div className="col">
                                        <label htmlFor="team">Branch</label>
                                        <input
                                          type="text"
                                          name="branch"
                                          className="form-control mb-3 "
                                          value={data.branch}
                                          placeholder="Branch"
                                          readOnly={true}
                                        />
                                      </div>
                                      <div className="col">
                                        <label>Amount</label>
                                        <input
                                          type="number"
                                          name="selling_value"
                                          value={data.selling_value}
                                          className="form-control mb-3 "
                                          placeholder="Type value"
                                          readOnly={true}
                                          required
                                        />
                                      </div>
                                    </div>
                                    {this.state.type === "wgst" && (
                                      <div className="row">
                                        <div className="col-md-3">
                                          <label>GST Number</label>
                                          <input
                                            type="text"
                                            name="gst_number"
                                            value={data.gst_number}
                                            className="form-control mb-3 "
                                            placeholder="Type value"
                                            onChange={(e) =>
                                              this.handleList(
                                                i,
                                                "gst_number",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="col-md-3">
                                          <label>GST Percentage</label>
                                          <input
                                            type="number"
                                            value={data.gst_percentage}
                                            name="gst_percentage"
                                            className="form-control mb-3 "
                                            placeholder="Type value"
                                            readOnly={true}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    {i > 0 && (
                                      <div
                                        className="ms-2 d-flex justify-content-center align-items-center"
                                        style={{
                                          marginLeft: "100px",
                                          marginTop: "-53px",
                                        }}
                                      >
                                        <input
                                          onClick={() => this.removeList(i)}
                                          type="button"
                                          value="Remove"
                                          className="btn btn-primary"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              <input
                                onClick={(e) => this.addList(e)}
                                type="button"
                                value="Add"
                                className="btn btn-primary mt-4"
                              />
                            </div>
                            <div className="row">
                              <div className="col">
                                <label htmlFor="team">Payment Type</label>
                                <select
                                  className="form-control"
                                  value={this.state.payment_type}
                                  onChange={(e) =>
                                    this.onPaymentSelect(e.target.value)
                                  }
                                >
                                  <option>Select</option>
                                  {this.state.payment_types.map((data) => (
                                    <option value={data.name}>
                                      {data.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {this.state.payment_type === "EMI" && (
                                <>
                                  <div className="col">
                                    <label>Finance Name</label>
                                    <input
                                      type="text"
                                      name="finance_name"
                                      value={this.state.finance_name}
                                      className="form-control mb-3 "
                                      placeholder="Type value"
                                      onChange={this.onChange}
                                    />
                                  </div>
                                  <div className="col">
                                    <label>Order No</label>
                                    <input
                                      type="text"
                                      name="order_no"
                                      value={this.state.order_no}
                                      className="form-control mb-3 "
                                      placeholder="Type value"
                                      onChange={this.onChange}
                                    />
                                  </div>
                                  <div className="col">
                                    <label htmlFor="doj">Initial Amount</label>
                                    <input
                                      type="number"
                                      name="tenure"
                                      className="form-control mb-3 "
                                      value={this.state.tenure}
                                      placeholder="Type value"
                                      onChange={this.onChange}
                                      required
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="row">
                              <div className="col mt-4">
                                <label className="checkbox-holder">
                                  <input
                                    type="checkbox"
                                    name="is_information_saved"
                                    className="me-2 mt-4"
                                    checked={this.state.is_same}
                                    onChange={(e) =>
                                      this.setState({
                                        is_same: e.target.checked,
                                        shipping_name: this.state.name,
                                        shipping_address: this.state.address,
                                        shipping_email: this.state.email,
                                        shipping_phone: this.state.phone,
                                      })
                                    }
                                  />
                                  Save this information for shipping
                                </label>
                              </div>
                              <div className="col">
                                <label>Shipping User Name</label>
                                <input
                                  type="text"
                                  value={
                                    this.state.is_same
                                      ? this.state.name
                                      : this.state.shipping_name
                                  }
                                  name="shipping_name"
                                  className="form-control mb-3 "
                                  placeholder="Type value"
                                  onChange={this.onChange}
                                  readOnly={this.state.is_same}
                                />
                              </div>
                              <div className="col">
                                <label>Shipping User Address</label>
                                <input
                                  type="text"
                                  name="shipping_address"
                                  value={
                                    this.state.is_same
                                      ? this.state.address
                                      : this.state.shipping_address
                                  }
                                  className="form-control mb-3 "
                                  placeholder="Type value"
                                  onChange={this.onChange}
                                  readOnly={this.state.is_same}
                                />
                              </div>
                              <div className="col">
                                <label>Shipping User Email</label>
                                <input
                                  type="email"
                                  name="shipping_email"
                                  value={
                                    this.state.is_same
                                      ? this.state.email
                                      : this.state.shipping_email
                                  }
                                  readOnly={this.state.is_same}
                                  className="form-control mb-3 "
                                  placeholder="Type value"
                                  onChange={this.onChange}
                                />
                              </div>
                              <div className="col">
                                <label>Shipping User Phone</label>
                                <input
                                  type="number"
                                  name="shipping_phone"
                                  value={
                                    this.state.is_same
                                      ? this.state.phone
                                      : this.state.shipping_phone
                                  }
                                  className="form-control mb-3 "
                                  placeholder="Type value"
                                  onChange={this.onChange}
                                  readOnly={this.state.is_same}
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

export default EditSales;
