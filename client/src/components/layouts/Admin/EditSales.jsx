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
      branch: "Select Branch",
      branchList: [],
      inwardList: [],
      sale_id: '',
      purchased_value: '',
      sales_person: '',
      empList: [],
      selectionOption: {},
      options: [],
      finance_name: '', 
      order_no: '', 
      is_same: false,
      shipping_address: '',
      shipping_name: '', 
      shipping_email: '', 
      shipping_phone: '',
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const branchList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getBranchList");
    const stock=  ['firstPurchase', 'secondPurchase'];
    const inwardList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getInWardList?stock=" + stock);    const saleId = this.props.match.params.id;
    this.setState({sale_id: saleId});
    const salesData = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getSaleData/${saleId}`);
    const imeiNumberList = this.state.imeiNumberList;
    inwardList.data.map(async (data) => {
      imeiNumberList.push(
        data.imei_number,
      );
    });
    const options = [];
    inwardList.data.map(async (data) => {
      options.push({
        value: data.imei_number,
        label: data.product.name +
        " - " +
        data.product.model +
        " - " +
        data.product.variant +
        " - " +
        data.product.color + '-' + data.imei_number,
      });
    });
    const empList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getEmpList");

    this.setState({
      empList: empList.data,
      imeiNumberList: imeiNumberList,
      branchList: branchList.data,
      inwardList: inwardList.data,
      options: options,
      selectionOption: {
        value: salesData.data.imei_number,
        //label: salesData.data.imei_number
        label: salesData.data.inward.product.name +
        " - " +
        salesData.data.inward.product.model +
        " - " +
        salesData.data.inward.product.variant +
        " - " +
        salesData.data.inward.product.color + '-' + salesData.data.imei_number,
      },
      ...salesData.data
    });
    
  };
  onBranchSelect = (branch) => {
    console.log("onBranchSelect", branch);
    this.setState({ branch });
  }

  onPaymentSelect = (payment_type) => this.setState({ payment_type });

  onSubmit = async (dispatch, e) => {
    e.preventDefault();
    const {
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
      finance_name, order_no, shipping_address, shipping_name, shipping_email, shipping_phone
    } = this.state;
    // disable signup btn
    this.setState({
      disabled: true,
    });
    try {
      const newUser = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/addSale", {
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
        finance_name, order_no, shipping_address, shipping_name, shipping_email, shipping_phone
      });

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
  }
  onEmpSelect = (sales_person) => this.setState({ sales_person });


  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/viewSales/' + this.state.type);
  }

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
                            <h3 className="">Sales</h3>
                            <hr />

                            <div className="row">
                              <div className="col">
                                <label htmlFor="team">IMEI/Serial Number</label>
                                <input
                                  type="text"
                                  name="imei_number"
                                  value={this.state.imei_number}
                                  className="form-control"
                                  placeholder="Name"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
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
                            </div>

                            <div className="row">
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
                              <label htmlFor="team">Branch</label>
                              <input
                                  type="text"
                                  name="branch"
                                  className="form-control mb-3 "
                                  value={this.state.branch}
                                  placeholder="Branch"
                                  onChange={this.onChange}
                                  readOnly={true}
                                />
                              </div>
                              <div className="col">
                              <label htmlFor="team">Sales Person</label>
                              <select className="form-control" value={this.state.sales_person} onChange={(e) =>
                                          this.onEmpSelect(e.target.value)
                                        }>
                                <option>Select</option>
                                {this.state.empList.map((data) => (
                                    <option value={data.name}>{data.name}</option>
                                ))
                                }
                                </select>
                              </div>
                              <div className="col">
                                {/* dos */}
                                <label htmlFor="doj">Date Of Sale</label>
                                <input
                                  type="date"
                                  name="dos"
                                  value={this.state.dos}
                                  className="form-control mb-3 "
                                  placeholder="dos"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>

                              {/* role */}
                            </div>

                            <div className="row">
                              <div className="col">
                                <label htmlFor="team">Payment Type</label>
                                <select className="form-control" value={this.state.payment_type} onChange={(e) =>
                                          this.onPaymentSelect(e.target.value)
                                        }>
                                <option>Select</option>
                                {this.state.payment_types.map((data) => (
                                    <option value={data.name}>{data.name}</option>
                                ))
                                }
                                </select>
                              </div>
                              {this.state.payment_type === "EMI" && (
                                <>
                                <div className="col">
                                <label>Finance Name</label>
                                  <input
                                    type="text"
                                    value={this.state.finance_name}
                                    name="finance_name"
                                    className="form-control mb-3 "
                                    placeholder="Type value"
                                    onChange={this.onChange}
                                    
                                  />
                                </div>
                                <div className="col">
                                <label>Order No</label>
                                  <input
                                    type="text"
                                    value={this.state.order_no}
                                    name="order_no"
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
                                    value={this.state.tenure}
                                    className="form-control mb-3 "
                                    placeholder="Type value"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                                </>
                              )}
                              <div className="col">
                                <label>Amount</label>
                                <input
                                  type="number"
                                  name="selling_value"
                                  value={this.state.selling_value}
                                  className="form-control mb-3 "
                                  placeholder="Type value"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>
                            {
                              this.state.type === 'wgst' &&
                            <div className="row">
                            <div className="col">
                                <label>GST Number</label>
                                <input
                                  type="text"
                                  name="gst_number"
                                  value={this.state.gst_number}
                                  className="form-control mb-3 "
                                  placeholder="Type value"
                                  onChange={this.onChange}
                                  
                                />
                              </div>
                              <div className="col">
                                <label>GST Percentage</label>
                                <input
                                  type="number"
                                  name="gst_percentage"
                                  value={this.state.gst_percentage}
                                  className="form-control mb-3 "
                                  placeholder="Type value"
                                  onChange={this.onChange}
                                  
                                />
                              </div>
                            </div>
                            }
                                                        <div className="row">
                              <div className="col">
                              <label className="checkbox-holder">
                                <input
                                  type="checkbox"
                                  name="is_information_saved"
                                  className="me-2"
                                  checked={this.state.is_same}
                                  onChange={(e) =>
                                    this.setState({
                                      is_same: e.target.checked,
                                      shipping_name: this.state.name,
                                      shipping_address: this.state.address,
                                      shipping_email: this.state.email,
                                      shipping_phone: this.state.phone
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
                                    value={this.state.is_same ? this.state.name : this.state.shipping_name}
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
                                    value={this.state.is_same ? this.state.address : this.state.shipping_address}
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
                                    value={this.state.is_same ? this.state.email : this.state.shipping_email}
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
                                    value={this.state.is_same ? this.state.phone : this.state.shipping_phone}
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
