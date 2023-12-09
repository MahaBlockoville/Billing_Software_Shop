import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../../assets/side-panel-styles/sidePanel.css";

export default class SidePanel extends Component {
  constructor() {
    super();

    this.state = {
      admin: undefined,
    };
  }

  componentDidMount = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const tokenRes = await axios.post(process.env.REACT_APP_API_URL +"/api/admin/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });

      if (tokenRes.data) {
        //logged in
        const adminRes = await axios.get(process.env.REACT_APP_API_URL +"/api/admin", {
          headers: { "x-auth-token": token },
        });
        console.log("admin profile: ", adminRes.data.user);
        this.setState({
          admin: adminRes.data.user,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const currLocation = window.location.href.split("#/")[1];
    return (
      <div className="mt-4 container-fluid">
        {/* stats*/}
        <Link to="/statistics" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i
              className="fas fa-chart-bar mr-4"
              style={{ fontSize: "20px" }}
            ></i>{" "}
            {currLocation === "statistics" || currLocation === "" ? (
              <b>Home</b>
            ) : (
              "Home"
            )}
          </li>
        </Link>

        <ul className="nav flex-column flex-nowrap">
          {
            this.state.admin && (this.state.admin.role === "admin" || this.state.admin.role === "branch") && 
            <li className="nav-item">
            <a className="nav-link list-group-item text-dark border-0 my-1 myList collapsed" href="#submenu1" data-toggle="collapse" data-target="#submenu1">
            <i
                    className="fa fa-tasks mr-4"
                    style={{ fontSize: "20px" }}
                  ></i> 
            Manage
            </a>
            <div className="collapse" id="submenu1" aria-expanded="false">
              <ul className="flex-column pl-2 nav list-group">
                {
                  this.state.admin.role === "admin" && 
                  <>
                  <Link to="/viewEmployees" style={{ textDecoration: "none" }}>
                  <li className="list-group-item text-dark border-0 my-1 myList nav-item">
                  <i class="fas fa-users mr-4"
                  style={{ fontSize: "20px" }}></i>
                  {currLocation === "viewEmployees" ? (
                      <b>Employee</b>
                    ) : (
                      "Employee"
                    )}
                  </li>
                </Link>
                
                <Link to="/viewSupplier" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-industry mr-4"
                style={{ fontSize: "20px" }}></i>
                {currLocation === "viewSupplier" ? <b>Supplier</b> : "Supplier"}
                </li>
              </Link>
              <Link to="/viewBranches" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-code-branch mr-4"
                style={{ fontSize: "20px" }}></i>
                  {currLocation === "addBranch" ? <b>Branch</b> : "Branch"}
                </li>
              </Link>
              <Link to="/viewStockTransfer" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-clipboard mr-4"
                style={{ fontSize: "20px" }} aria-hidden="true"></i>
                  {currLocation === "/viewStockTransfer" ? <b>Stock Transfer</b> : "Stock Transfer"}
                </li>
              </Link>
              </>
              }
              <Link to="/viewProduct" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fa fa-product-hunt mr-4"
                style={{ fontSize: "20px" }} aria-hidden="true"></i>
                  {currLocation === "viewProduct" ? <b>Product</b> : "Product"}
                </li>
              </Link>
              {
                this.state.admin.role === "admin" &&
                <Link to="/viewCategory" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-clipboard mr-4"
                style={{ fontSize: "20px" }} aria-hidden="true"></i>
                  {currLocation === "/viewCategory" ? <b>Category</b> : "Category"}
                </li>
              </Link>
              
              }
              </ul>
            </div>
          </li>
          }

        </ul>

        <ul className="nav flex-column flex-nowrap">
          <li className="nav-item">
            <a className="nav-link list-group-item text-dark border-0 my-1 myList collapsed" href="#submenu2" data-toggle="collapse" data-target="#submenu2">
            <i
                    className="fas fa-newspaper	 mr-4"
                    style={{ fontSize: "20px" }}
                  ></i> 
            Stock
            </a>
            <div className="collapse" id="submenu2" aria-expanded="false">
              <ul className="flex-column pl-2 nav list-group">
                <Link to="/viewInWards/firstPurchase" style={{ textDecoration: "none" }}>
                <li className="list-group-item text-dark border-0 my-1 myList nav-item">
                <i class="fas fa-cart-arrow-down mr-4"
                style={{ fontSize: "13px" }}></i>
                {currLocation === "viewInWards/firstPurchase" ? (
                    <b>Purchase</b>
                  ) : (
                    "Purchase"
                  )}
                </li>
              </Link>
                <Link to="/viewInWards/secondPurchase" style={{ textDecoration: "none" }} >
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-cart-plus mr-2"
                style={{ fontSize: "11px" }}></i>
                {currLocation === "viewInWards/secondPurchase" ? <b>Second Purchase</b> : "Second Purchase"}
                </li>
              </Link>
              <Link to="/viewInWards/purchaseReturn" style={{ textDecoration: "none" }} >
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-undo mr-2"
                style={{ fontSize: "11px" }} ></i>
                  {currLocation === "viewInWards/purchaseReturn" ? <b>Purchase Return</b> : "Purchase Return"}
                </li>
              </Link>
              <Link to="/viewInWards/secondReturn" style={{ textDecoration: "none" }} >
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fa fa-undo mr-4"
                style={{ fontSize: "13px" }} aria-hidden="true"></i>
                  {currLocation === "viewInWards/secondReturn" ? <b>Second Return</b> : "Second Return"}
                </li>
              </Link>
              
              {/* <Link to="/stockReport" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fa fa-product-hunt mr-4"
                style={{ fontSize: "13px" }} aria-hidden="true"></i>
                  {currLocation === "stockReport" ? <b> Report</b> : "Report"}
                </li>
              </Link> */}
              </ul>
            </div>
          </li>
        </ul>



        <ul className="nav flex-column flex-nowrap">
          <li className="nav-item">
            <a className="nav-link list-group-item text-dark border-0 my-1 myList collapsed" href="#submenu3" data-toggle="collapse" data-target="#submenu3">
            <i
                    className="fas fa-newspaper	 mr-4"
                    style={{ fontSize: "20px" }}
                  ></i> 
            Sale
            </a>
            <div className="collapse" id="submenu3" aria-expanded="false">
              <ul className="flex-column pl-2 nav list-group">
                <Link to="/viewSales/wgst" style={{ textDecoration: "none" }}>
                <li className="list-group-item text-dark border-0 my-1 myList nav-item">
                <i class="fas fa-cart-arrow-down mr-4"
                style={{ fontSize: "13px" }}></i>
                {currLocation === "viewSales/wgst" ? (
                    <b>Bill W GST</b>
                  ) : (
                    "Bill W GST"
                  )}
                </li>
              </Link>
                <Link to="/viewSales/wogst" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-cart-plus mr-2"
                style={{ fontSize: "11px" }}></i>
                {currLocation === "viewSales/wogst" ? <b>Bill WO GST</b> : "Bill WO GST"}
                </li>
              </Link>
              <Link to="/viewSales/return" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-undo mr-2"
                style={{ fontSize: "11px" }}></i>
                  {currLocation === "viewSales/return" ? <b>Sale Return</b> : "Sale Return"}
                </li>
              </Link>
              {/* <Link to="#" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fa fa-undo mr-4"
                style={{ fontSize: "13px" }} aria-hidden="true"></i>
                  {currLocation === "#" ? <b>Quotation</b> : "Quotation"}
                </li>
              </Link> */}
              </ul>
            </div>
          </li>
        </ul>

        <ul className="nav flex-column flex-nowrap">
          <li className="nav-item">
            <a className="nav-link list-group-item text-dark border-0 my-1 myList collapsed" href="#submenu4" data-toggle="collapse" data-target="#submenu4">
            <i
                    className="fas fa-newspaper	 mr-4"
                    style={{ fontSize: "20px" }}
                  ></i> 
            Account
            </a>
            <div className="collapse" id="submenu4" aria-expanded="false">
              <ul className="flex-column pl-2 nav list-group">
                <Link to="/dayBook" style={{ textDecoration: "none" }}>
                <li className="list-group-item text-dark border-0 my-1 myList nav-item">
                <i class="fas fa-cart-arrow-down mr-4"
                style={{ fontSize: "13px" }}></i>
                {currLocation === "dayBook" ? (
                    <b>Day Book</b>
                  ) : (
                    "Day Book"
                  )}
                </li>
              </Link>
                <Link to="/payroll" style={{ textDecoration: "none" }}>
                <li className="nav-item list-group-item text-dark border-0 my-1 myList">
                <i class="fas fa-cart-plus mr-1"
                style={{ fontSize: "10px" }}></i>
                {currLocation === "payroll" ? <b>Profit/Loss Report</b> : "Profit/Loss Report"}
                </li>
              </Link>
              </ul>
            </div>
          </li>
        </ul>
          {/* payroll 
          <Link to="/payroll" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-file-invoice mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "payroll" ? <b>Payroll</b> : "Payroll"}
            </li>
          </Link>
        */}
          {/* Active loans 
          <Link to="/activeLoans" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-hand-holding-usd mr-4"
                style={{ fontSize: "20px" }}
              ></i>
              {currLocation === "activeLoans" ? (
                <b>Active Loans</b>
              ) : (
                "Active Loans"
              )}
            </li>
          </Link>
          */}
          {/* options 
          <Link to="/options" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-sliders-h mr-4"
                style={{ fontSize: "20px" }}
              ></i>
              {currLocation === "options" ? <b>Options</b> : "Options"}
            </li>
          </Link>
          
        </ul>*/}
      </div>
    );
  }
}
