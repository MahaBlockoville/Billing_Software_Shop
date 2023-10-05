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
  };

  onFilterGender = () => {
    //   no of emp per team
    let teamDict = {};

    this.state.inwardList.forEach((emp) => {
      if (!teamDict[emp.product.category.name]) {
        teamDict[emp.product.category.name] = 1;
      } else {
        teamDict[emp.product.category.name]++;
      }
    });

    console.log("taem dict: ", teamDict);

    let datasets = this.state.datasets;
    let labels = [];
    let data = [];

    for (const property in teamDict) {
      labels.push(property);
      data.push(teamDict[property]);
    }

    console.log(data);

    datasets[0].data = data;

    this.setState({ datasets, labels });
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
