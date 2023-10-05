import axios from "axios";
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

export default class BarChart2 extends Component {
  constructor() {
    super();

    this.state = {
      // for chart
      smartPhoneCount: 0,
      featurePhoneCount: 0,
      accessoryCount: 0,
      saleList: [],

      labels: ["Smart Phone", "Featured Phone", "Accessories"],
      datasets: [
        {
          label: "Request count",
          backgroundColor: "#ffe0b3",
          borderColor: "orange",
          borderWidth: 2,
          data: [],
        },
      ],
    };
  }

  componentDidMount = async () => {
    axios.get(process.env.REACT_APP_API_URL +"/api/admin/getSalesList").then((saleList) => {
      this.setState({ saleList: saleList.data }, () => {
        this.onPopulateBarChart();
      });
    });

  };

  onPopulateBarChart = () => {
    //   no of emp per team
    let teamDict = {};

    this.state.saleList.forEach((emp) => {
      if (!teamDict[emp.inward.product.category.name]) {
        teamDict[emp.inward.product.category.name] = 1;
      } else {
        teamDict[emp.inward.product.category.name]++;
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
        <Bar
          data={this.state}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            title: {
              display: true,
              text: "No. of sales per product",
              fontSize: 20,
              position: "bottom",
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    );
  }
}
