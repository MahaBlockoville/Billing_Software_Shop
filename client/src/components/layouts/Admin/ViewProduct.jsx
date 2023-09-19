import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import AdminSidePanel from "./AdminSidePanel";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../assets/images/noEmp.png";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { createHashHistory } from 'history'
export const history = createHashHistory()

//import "../../../assets/add-product/addProduct.css";


export default class ViewProduct extends Component {
  constructor() {
    super();

    this.state = {
      productList: [],
      loading: true,
    };
  }

  componentDidMount = async () => {
    const productList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getProductList");
    console.log("List: ", productList.data);
    this.setState({
      productList: productList.data,
      loading: false,
    });
  };

  // to filter data according to search criteria
  onFilter = (productList) => {
    this.setState({ productList });
  };

  onClickAdd = (e) => {
    e.preventDefault();
    history.push('/addProduct');
  }

  onClickDelete = async (e, product_id) => {
    e.preventDefault();
    try {
      const deletedProduct = await axios.delete(process.env.REACT_APP_API_URL +"/api/admin/deleteProduct/"+ product_id);
      toast.notify("Deleted new product", {
        position: "top-right",
      });
      const productList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getProductList");
      this.setState({ productList: productList.data });
      console.log("deleted product successfully: ", deletedProduct.data);
      this.props.history.push(`/viewProduct`);
    } catch (err) {
      console.log("Error", e);
    }
  };

  onCancel = (e) => {
    e.preventDefault();
    this.props.history.push('/viewInWards');
  }

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;

          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && (user.role !== "admin"  && user.role !== 'branch'))
            return <Redirect to="/empDashBoard" />;

          return (
            <Spring
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ duration: 300 }}
            >
              {(props) => (
                <>
                  <div className="row m-0">
                    {/* left part */}
                    <div className="col-2 p-0 leftPart">
                      <AdminSidePanel />
                    </div>

                    {/* right part */}
                    <div className="col " style={props}>
                    <div className="row">
                    <div className="container mt-3">
                    <h3>Products</h3>
                    <div className="row mt-3 px-3">
                      <button className="btn btn-primary pull-right" style={{marginLeft: '800px'}} onClick={this.onClickAdd}>
                          <i
                            className="fas fa-user-plus p-2"
                            style={{ cursor: "pointer", fontSize: "20px" }}
                          ></i>
                          Create
                      </button>
                      </div>
                      </div>
                    </div>

                      <hr />

                      {/* branch list */}
                      {this.state.loading ? (
                        <h1 className="text-center">Loading...</h1>
                      ) : this.state.productList.length ? (
                        <div className="container">
                          <div
                            className="row"
                            style={{
                              display: "flex",
                            }}
                          >
        <div className="table table-striped sortable">
         <table className="inputTable searchable sortable">
           <thead>
            <th>Name</th>
            <th>Model</th>
            <th>Color</th>
            <th>Variant</th>
            <th>Category</th>
            <th>Supplier</th>
            <th></th>
            <th></th>

           </thead>
        {this.state.productList.map((data, index) => (
          <tbody>
               <td>{data.name}</td>
               <td>{data.model}</td>
               <td>{data.color}</td>
               <td>{data.variant}</td>
               <td>{data.category ? data.category.name : ''}</td>
               <td>{data.supplier ? data.supplier.company_name + '|' + data.supplier.contact_person : ''}</td>
               <td>
                 <Link
                    to={`/editProduct/${data._id}`}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
               </td>
               <td>
                 <Link
                    onClick={(e) => {
                      this.onClickDelete(e, data._id)
                    }}
                    to='viewProduct'
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </Link>
               </td>
            </tbody>
           ))}
         </table>
         </div>
                          </div>
                        </div>
                      ) : (
                        <div className="container  text-secondary text-center mt-2">
                          <img
                            src={noEmp}
                            alt=""
                            height="200px"
                            className="mt-5"
                          />
                          <h1 className="mt-4">No Product found...</h1>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
