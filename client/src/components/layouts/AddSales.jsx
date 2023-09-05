import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/add-emp/addEmp.css";
import AdminSidePanel from "./Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddSales extends Component {
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
      purchased_value: "",
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const type = this.props.match.params.type;
    this.setState({type: type});
    const branchList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getBranchList");
    const stock=  ['firstPurchase', 'secondPurchase'];
    const inwardList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getInWardList?stock=" + stock);
    const imeiNumberList = this.state.imeiNumberList;
    inwardList.data.map(async (data) => {
      imeiNumberList.push(
         data.imei_number,
      );
    });
    this.setState({
      imeiNumberList: imeiNumberList,
      branchList: branchList.data,
      inwardList: inwardList.data,
    });
  };
  onBranchSelect = (branch) => this.setState({ branch });

  onNumberSelect = (imei_number) => {
    const currentInward = this.state.inwardList.filter(inward => inward.imei_number === imei_number);
    console.log(currentInward);
    this.setState({ 
      imei_number, branch: currentInward[0].branch,
      purchased_value: currentInward[0].selling_value,
    });
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
      type
    } = this.state;

    if(selling_value < this.state.purchased_value) {
      this.setState({ error: "Amount must be less than or equal to the product selling value" });
    }else {
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
          type
        });
  
        toast.notify("Added new item", {
          position: "top-right",
        });
  
        console.log("created acc successfully: ", newUser.data);
        this.props.history.push(`/viewSales/${type}`);
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

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/viewSales');
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
                                <select className="form-control" onChange={(e) =>
                                          this.onNumberSelect(e.target.value)
                                        }>
                                <option>Select</option>
                                {this.state.imeiNumberList.map((data) => (
                                    <option value={data}>{data}</option>
                                ))
                                }
                                </select>
                              </div>
                              <div className="col">
                                {/* name */}
                                <label htmlFor="name">Customer Name</label>
                                <input
                                  type="text"
                                  name="name"
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
                                  className="form-control mb-3 "
                                  placeholder="Email"
                                  onChange={this.onChange}
                                  required
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
                                {/* dos */}
                                <label htmlFor="doj">Date Of Sale</label>
                                <input
                                  type="date"
                                  name="dos"
                                  className="form-control mb-3 "
                                  placeholder="dos"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>

                              {/* role */}
                            </div>

                            <div className="row">
                              <div className="col-md-4">
                                <label htmlFor="team">Payment Type</label>
                                <select className="form-control" onChange={(e) =>
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
                                <div className="col-md-4">
                                  <label htmlFor="doj">Initial Amount</label>
                                  <input
                                    type="number"
                                    name="tenure"
                                    className="form-control mb-3 "
                                    placeholder="Type value"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                              )}
                              <div className="col-md-4">
                                <label>Amount</label>
                                <input
                                  type="number"
                                  name="selling_value"
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
                                    className="form-control mb-3 "
                                    placeholder="Type value"
                                    onChange={this.onChange}
                                    
                                  />
                                </div>
                              </div>
                            }

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

export default AddSales;
