import React, { Component } from "react";
import { Provider } from "./context";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ContactUs from "./components/layouts/ContactUs";
import PageNotFound from "./components/layouts/PageNotFound";
import About from "./components/layouts/About";

import "./App.css";
import Header from "./components/layouts/Header";
import AddEmployee from "./components/layouts/AddEmployee";
import Profile from "./components/layouts/Profile";
import EmpDashboard from "./components/layouts/EmpDashboard";
import Attendence from "./components/layouts/Employee/Attendence";
import ViewRequests from "./components/layouts/Admin/View Requests/ViewRequests";
import MyRequests from "./components/layouts/Employee/MyRequests";
import OtherRequests from "./components/layouts/Employee/OtherRequests";
import ViewEmployees from "./components/layouts/Admin/ViewEmployees";
import EditEmpProfile from "./components/layouts/Admin/EditEmpProfile";
import MySalDetails from "./components/layouts/Employee/MySalDetails";
import Payroll from "./components/layouts/Admin/Payroll";
import Statistics from "./components/layouts/Admin/Stats/Statistics";
import Options from "./components/layouts/Admin/Options";
import ViewSingleRequest from "./components/layouts/Employee/ViewSingleRequest";
import CompanyInfo from "./components/layouts/Employee/CompanyInfo";
import ActiveLoans from "./components/layouts/Admin/ActiveLoans";
import AddBranch from "./components/layouts/Admin/AddBranch";
import ViewBranches from "./components/layouts/Admin/View Requests/ViewBranches";
import AddInWard from "./components/layouts/AddInWard";
import ViewInWards from "./components/layouts/Admin/View Requests/ViewInWards";
import EditInWard from "./components/layouts/Admin/EditInWard";
import AddSales from "./components/layouts/AddSales";
import ViewSales from "./components/layouts/Admin/View Requests/ViewSales";
import EditSales from "./components/layouts/Admin/EditSales";
import ViewCategory from "./components/layouts/Admin/ViewCategory";
import AddCategory from "./components/layouts/Admin/AddCategory";
import EditCategory from "./components/layouts/Admin/EditCategory";
import ViewSupplier from "./components/layouts/Admin/ViewSupplier";
import AddSupplier from "./components/layouts/Admin/AddSupplier";
import EditSupplier from "./components/layouts/Admin/EditSupplier";
import ViewProduct from "./components/layouts/Admin/ViewProduct";
import AddProduct from "./components/layouts/Admin/AddProduct";
import EditProduct from "./components/layouts/Admin/EditProduct";
import StockReport from "./components/layouts/Admin/StockReport";
import GenerateSalesReport from "./components/layouts/Admin/GenerateSaleReport";
import DayBook from "./components/layouts/Admin/DayBook";
import EditBranch from "./components/layouts/Admin/EditBranch";

export default class App extends Component {
  render() {
    return (
      <Provider>
        <Router>
          <div>
            <Header branding="GetEasyTech" />

            <Switch>
              {/* general */}
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/contactus" component={ContactUs} />
              <Route exact path="/about" component={About} />

              {/* emp related */}
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/attendence" component={Attendence} />
              <Route exact path="/myRequests" component={MyRequests} />
              <Route exact path="/empDashboard" component={EmpDashboard} />
              <Route exact path="/otherRequest" component={OtherRequests} />
              <Route exact path="/mySalDetails" component={MySalDetails} />
              <Route exact path="/companyInfo" component={CompanyInfo} />
              <Route
                exact
                path="/viewSingleRequest/:title/:reqId"
                component={ViewSingleRequest}
              />

              {/* admin related */}
              <Route exact path="/" component={Statistics} />
              <Route exact path="/add" component={AddEmployee} />
              <Route exact path="/viewRequests" component={ViewRequests} />
              <Route exact path="/addSales/:type" component={AddSales} />
              <Route exact path="/viewSales/:type" component={ViewSales} />
              <Route exact path="/salesBill/:id" component={GenerateSalesReport} />
              <Route exact path="/dayBook" component={DayBook} />

              <Route exact path="/viewCategory" component={ViewCategory} />
              <Route exact path="/addCategory" component={AddCategory} />
              <Route exact path="/editCategory/:id" component={EditCategory} />

              <Route exact path="/viewBranches" component={ViewBranches} />
              <Route exact path="/addBranch" component={AddBranch} />
              <Route exact path="/editBranch/:id" component={EditBranch} />
              
              <Route exact path="/viewSupplier" component={ViewSupplier} />
              <Route exact path="/addSupplier" component={AddSupplier} />
              <Route exact path="/editSupplier/:id" component={EditSupplier} />

              <Route exact path="/viewInWards/:type" component={ViewInWards} />

              <Route exact path="/addInWard/:type" component={AddInWard} />

              <Route exact path="/stockReport" component={StockReport} />

              
              <Route exact path="/viewProduct" component={ViewProduct} />
              <Route exact path="/addProduct" component={AddProduct} />
              <Route exact path="/editProduct/:id" component={EditProduct} />
              
              
              <Route exact path="/statistics" component={Statistics} />
              <Route exact path="/options" component={Options} />
              <Route exact path="/payroll" component={Payroll} />
              <Route exact path="/viewEmployees" component={ViewEmployees} />
              <Route exact path="/activeLoans" component={ActiveLoans} />
              <Route
                exact
                path="/editEmpProfile/:id"
                component={EditEmpProfile}
              />
              <Route
                exact
                path="/editInWard/:id"
                component={EditInWard}
              />
              <Route
                exact
                path="/editSales/:id"
                component={EditSales}
              />
              
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
