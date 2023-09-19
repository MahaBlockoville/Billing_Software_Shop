import React, { Component } from "react";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../../assets/add-branch/addBranch.css";
import AdminSidePanel from "./AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class EditSupplier extends Component {
  constructor() {
    super();

    this.state = {
      company_name: "",
      contact_person: "", 
      contact_number: "", 
      gst_number: "",
      address: "",
      disabled: false,
      supplier_id: '',
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const supplierId = this.props.match.params.id;
    this.setState({supplier_id: supplierId});
    const supplierData = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getSupplierData/${supplierId}`);
    this.setState({
      ...supplierData.data
    });
  };

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      company_name, contact_person, contact_number, gst_number, address,
      supplier_id
    } = this.state;

    try {
      const newUser = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/addSupplier", {
        company_name, contact_person, contact_number, gst_number, address, supplier_id
      });

      toast.notify("Added new supplier", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/viewSupplier`);
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      alert(err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/viewSupplier');
  }

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
                        className="col-md-6"
                        style={{
                          //display: "flex ",
                          flexDirection: "row",
                          justifyContent: "center",
                          marginRight: '350px',
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
                            <h3 className="">EDIT SUPPLIER</h3>
                            <hr />

                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Supplier Name</label>
                                <input
                                  type="text"
                                  name="company_name"
                                  value={this.state.company_name}
                                  className="form-control"
                                  placeholder="Supplier Name"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Contact Person</label>
                                <input
                                  type="text"
                                  name="contact_person"
                                  value={this.state.contact_person}
                                  className="form-control"
                                  placeholder="Contact Person"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Contact Number</label>
                                <input
                                  type="number"
                                  name="contact_number"
                                  value={this.state.contact_number}
                                  className="form-control"
                                  placeholder="Contact Number"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">GST Number</label>
                                <input
                                  type="text"
                                  name="gst_number"
                                  value={this.state.gst_number}
                                  className="form-control"
                                  placeholder="Gst Number"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Address</label>
                                <input
                                  type="text"
                                  name="address"
                                  value={this.state.address}
                                  className="form-control"
                                  placeholder="Address"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
<br/>
                            <div className="row">
                              {/* dop */}
                              <div className="col-sm-6 mx-auto">
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Submit"
                              className="btn btn-primary align-center"
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;
                                <input
                                  onClick={this.onCancel}
                                  type="button"
                                  value="Back"
                                  className="btn btn-primary"
                                />
                            </div>
                            </div>
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

export default EditSupplier;
