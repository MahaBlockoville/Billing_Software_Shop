import axios from "axios";
import React, { Component } from "react";
import { Pie } from "react-chartjs-2";

export default class PieChart extends Component {
  constructor() {
    super();

    this.state = {
      inwardList: [],

      // pie chart
      labels: [],
      datasets: [
        {
          label: "InWard",
          backgroundColor: ["#cbb4ca", "#A8DCD9"],
          borderColor: "white",
          data: [],
        },
      ],
    };
  }

  componentDidMount = async () => {
    const stock=  ['firstPurchase', 'secondPurchase'];
    axios.get(process.env.REACT_APP_API_URL +"/api/admin/getInWardList?stock=" + stock).then((inwardList) => {
      this.setState({ inwardList: inwardList.data }, () => {
        this.onFilterGender();
      });
    });
    const categoryList = await axios.get(process.env.REACT_APP_API_URL +"/api/admin/getCategoryList");
    const labels = [];
    categoryList.data.map(async (category) => {
      labels.push(category.name);
    })
    this.setState({ labels: labels});
  };

  onFilterGender = () => {
    let smartPhoneCount = 0;
    let featurePhoneCount = 0;
    let accessoryCount = 0;
    this.state.inwardList.forEach((emp) => {
      if (emp.category === "Smart Phone") smartPhoneCount = parseInt(smartPhoneCount) + 1;
      else if (emp.category === "Featured Phone") featurePhoneCount = parseInt(featurePhoneCount) + 1;
      else accessoryCount = parseInt(accessoryCount) + 1;
    });

    let datasets = [...this.state.datasets];
    datasets[0].data = [smartPhoneCount, featurePhoneCount, accessoryCount];

    this.setState({ datasets });
  };

  render() {
    return (
      <div
        className="chartContainer"
        style={{ height: "250px", padding: "10px" }}
      >
        <Pie
          data={this.state}
          options={{
            title: {
              display: true,
              text: "Inward product ratio",
              fontSize: 20,
              position: "bottom",
            },
            legend: {
              display: true,
              position: "left",
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    );
  }
}
