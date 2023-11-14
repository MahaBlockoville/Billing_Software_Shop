import axios from "axios";
import React, { Component } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import BarChart2 from "./BarChart2";
import AdminSidePanel from "../AdminSidePanel";
import "../../../../assets/stats-styles/stats.css";
import Card from "./Card";
import { Consumer } from "../../../../context";
import { Redirect } from "react-router-dom";
import { Spring } from "react-spring/renderprops";
export default class Statistics extends Component {
  constructor() {
    super();

    this.state = {
      empList: [],
      salesList: [],
      inwardList: [],
      totalExpenses: 0,
      inwardExpenses: 0,
    };
  }

  componentDidMount = async () => {
    const empList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getEmpList");
    const salesList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSalesList");
    const stock=  ['firstPurchase', 'secondPurchase'];
    const inwardList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getInWardList?stock=" + stock);

    this.setState(
      {
        empList: empList.data,
        salesList: salesList.data,
        inwardList: inwardList.data,
      },
      () => {
        this.calTotalExpenses();
        this.calLoanExpenses();
      }
    );
  };

  calLoanExpenses = () => {
    let totalLoan = 0;

    console.log("emp loan list: ", this.state.inwardList);

    this.state.inwardList.forEach((loan) => {
      //if (!loan.loanRepaid) 
      totalLoan += parseInt(loan.selling_value);
    });

    this.setState({ loanExpenses: totalLoan });
  };

  calTotalExpenses = () => {
    let totalExpenses = 0;
    console.log("emp sal list: ", this.state.salesList);
    this.state.salesList.forEach((emp) => {
      if(emp.selling_value) {
        totalExpenses += parseInt(emp.selling_value);
      }
    });

    this.setState({ totalExpenses });
    let inwardExpenses = 0;
    this.state.inwardList.forEach((emp) => {
      inwardExpenses += parseInt(emp.selling_value);
    });

    this.setState({ inwardExpenses });

  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && (user.role !== "admin" && user.role !== "branch"))
            return <Redirect to="/empDashBoard" />;

          //added this condition coz it was showing admin panel till emp data was loaded
          if (user && (user.role === "admin" || user.role === 'branch'))
            return (
              <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={{ duration: 300 }}
              >
                {(props) => (
                  <div className="row m-0">
                    {/* left part */}
                    <div className="col-2 p-0 leftPart">
                      <AdminSidePanel />
                    </div>

                    {/* right part */}
                    <div className="col-9 rightPart container" style={props}>
                      {/* numbers */}
                      <div className="row mt-5">
                        <div className="col ">
                          <Card
                            label="Total Sales"
                            data={`₹ ${this.state.totalExpenses}`}
                          />
                        </div>
                        <div className="col ">
                          <Card
                            label="InWard worth"
                            data={`₹ ${this.state.inwardExpenses}`}
                          />
                        </div>
                        <div className="col">
                          <Card
                            label="Employee Count"
                            data={this.state.empList.length}
                          />
                        </div>
                      </div>

                      {/* charts */}
                      <div className="row mt-5">
                        <div className="col-6 my-4">
                          <PieChart />
                        </div>

                        <div className="col-6 my-4">
                          <BarChart />
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col-12 my-4">
                          <BarChart2 />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Spring>
            );
        }}
      </Consumer>
    );
  }
}
