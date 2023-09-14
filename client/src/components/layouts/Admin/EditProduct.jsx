import React, { Component } from "react";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../../assets/add-branch/addBranch.css";
import AdminSidePanel from "./AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class EditProduct extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      model: "",
      color: "", 
      variant: "", 
      hsn: "",
      category: "",
      supplier: "",
      categoryList: [],
      supplierList: [],
      disabled: false,
      product_id: '',
      // error
      error: "",
    };
  }

  componentDidMount = async () => {
    const productId = this.props.match.params.id;
    this.setState({product_id: productId});
    const productData = await axios.get(process.env.REACT_APP_API_URL +`/api/admin/getProductData/${productId}`);
    this.setState({
      ...productData.data
    });
    const categoryList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getCategoryList");
    const supplierList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSupplierList");
    this.setState({
      supplier: productData.data.supplier.company_name,
      category: productData.data.category ? productData.data.category.name : '',
      categoryList: categoryList.data,
      supplierList: supplierList.data
    })
  };

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      name, model, color, variant, category, supplier,
      product_id, hsn
    } = this.state;

    try {
      const newUser = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/addProduct", {
        name, model, color, variant, category, supplier, product_id, hsn
      });

      toast.notify("Added new product", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/viewProduct`);
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

  onCategorySelect = (category) => {
    this.setState({ category });
  }

  onSupplierSelect = (supplier) => {
    this.setState({ supplier });
  }

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/viewProduct');
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
                            <h3 className="">EDIT PRODUCT</h3>
                            <hr />

                            <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Brand Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.name}
                                  className="form-control"
                                  placeholder="Brand Name"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Color</label>
                                <input
                                  type="text"
                                  value={this.state.color}
                                  name="color"
                                  className="form-control"
                                  placeholder="Color"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Model</label>
                                <input
                                  type="text"
                                  name="model"
                                  value={this.state.model}
                                  className="form-control"
                                  placeholder="Model"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Variant</label>
                                <input
                                  type="text"
                                  name="variant"
                                  value={this.state.variant}
                                  className="form-control"
                                  placeholder="Variant"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">HSN</label>
                                <input
                                  type="number"
                                  value={this.state.hsn}
                                  name="hsn"
                                  className="form-control"
                                  placeholder="HSN"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Category</label>
                                <select className="form-control"
                                value={this.state.category}
                               onChange={(e) =>
                                          this.onCategorySelect(e.target.value)
                                        }>
                                <option>Select</option>
                                {this.state.categoryList.map((data) => (
                                    <option value={data.name}>{data.name}</option>
                                ))
                                }
                                </select>
                    
                              </div>
                              </div>
                              <div className="row">
                              <div className="col-sm-6 mx-auto">
                                {/* name */}
                                <label htmlFor="name">Supplier Name</label>
                                <select className="form-control"
                                value={this.state.supplier}
                               onChange={(e) =>
                                          this.onSupplierSelect(e.target.value)
                                        }>
                                <option>Select</option>
                                {this.state.supplierList.map((data) => (
                                    <option value={data.company_name}>{data.company_name}</option>
                                ))
                                }
                                </select>
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

export default EditProduct;
