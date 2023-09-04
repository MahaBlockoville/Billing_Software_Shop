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

//import "../../../assets/add-supplier/addSupplier.css";


export default class ViewSupplier extends Component {
  constructor() {
    super();

    this.state = {
      supplierList: [],
      loading: true,
    };
  }

  componentDidMount = async () => {
    const supplierList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSupplierList");
    console.log("List: ", supplierList.data);
    this.setState({
      supplierList: supplierList.data,
      loading: false,
    });
  };

  // to filter data according to search criteria
  onFilter = (supplierList) => {
    this.setState({ supplierList });
  };

  onClickAdd = (e) => {
    e.preventDefault();
    history.push('/addSupplier');
  }

  onClickDelete = async (e, supplier_id) => {
    e.preventDefault();
    try {
      const deletedSupplier = await axios.delete(process.env.REACT_APP_API_URL +"/api/admin/deleteSupplier/"+ supplier_id);
      toast.notify("Deleted new supplier", {
        position: "top-right",
      });
      const supplierList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSupplierList");
      this.setState({ supplierList: supplierList.data });
      console.log("deleted supplier successfully: ", deletedSupplier.data);
      this.props.history.push(`/viewSupplier`);
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
          if (user && user.role !== "admin")
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
                    <h3>Suppliers</h3>
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
                      ) : this.state.supplierList.length ? (
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
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Contact Number</th>
            <th>Gst Number</th>
            <th>Address</th>
            <th></th>
            <th></th>

           </thead>
        {this.state.supplierList.map((data, index) => (
          <tbody>
               <td>{data.company_name}</td>
               <td>{data.contact_person}</td>
               <td>{data.contact_number}</td>
               <td>{data.gst_number}</td>
               <td>{data.address}</td>
               <td>
                 <Link
                    to={`/editSupplier/${data._id}`}
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
                    to='viewSupplier'
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
                          <h1 className="mt-4">No Supplier found...</h1>
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
