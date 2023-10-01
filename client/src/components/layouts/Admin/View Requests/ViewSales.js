import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../../context";
import AdminSidePanel from "../AdminSidePanel";
import { Spring } from "react-spring/renderprops";
import noEmp from "../../../../assets/images/noEmp.png";
import SearchSale from "../SearchSale";
import SaleCard from "../SaleCard";

export default class ViewSales extends Component {
  constructor() {
    super();

    this.state = {
      salesList: [],
      branch: '',
      loading: true,
    };
  }

  componentDidMount = async () => {
    const type = this.props.match.params.type;
    this.setState({type: type});

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
        branch: adminRes.data.user ? adminRes.data.user.name : ''
      });
      if(adminRes.data.user && adminRes.data.user.name)  {
        const salesList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSalesList?type=" + type + "&branch=" + adminRes.data.user.name);
        console.log("List: ", salesList.data);
        this.setState({
          salesList: salesList.data,
          loading: false,
        });
      } else {
        const salesList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSalesList?type=" + type);
        console.log("List: ", salesList.data);
        this.setState({
          salesList: salesList.data,
          loading: false,
        });
      }
    }
  };


  componentDidUpdate = async (prevProps, prevState) => {
    if(prevProps.match.params !== undefined && 
      this.props.match.params !== undefined &&
      prevProps.match.params.type !==  this.props.match.params.type) {
      const type = this.props.match.params.type;
      this.setState({type: type});
      const salesList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSalesList?type="+ type);
      console.log("List: ", salesList.data);
      this.setState({
        salesList: salesList.data,
        loading: false,
      });
    }
  }

  // to filter data according to search criteria
  onFilter = (salesList) => {
    this.setState({ salesList });
  };

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
                        <SearchSale onFilter={this.onFilter} type={this.state.type} />
                      </div>

                      {/* branch list */}
                      {this.state.loading ? (
                        <h1 className="text-center">Loading...</h1>
                      ) : this.state.salesList.length ? (
                        <div className="container">
                          <div
                            className="row"
                            style={{
                              display: "flex",
                            }}
                          >
                          <SaleCard salesList={this.state.salesList}  type={this.state.type} />
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
                          <h1 className="mt-4">No Sales found...</h1>
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
