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
    axios.get("/api/admin/getSalesList").then((saleList) => {
      let smartPhoneCount = 0;
      let featurePhoneCount = 0;
      let accessoryCount = 0;
      saleList.data.forEach((emp) => {
        if (emp.category === "Smart Phone") smartPhoneCount = parseInt(smartPhoneCount) + 1;
        else if (emp.category === "Featured Phone") featurePhoneCount = parseInt(featurePhoneCount) + 1;
        else accessoryCount = parseInt(accessoryCount) + 1;
      });
      this.setState(
        {
          smartPhoneCount,
          featurePhoneCount,
          accessoryCount,
        },
        () => {
          this.onPopulateBarChart();
        }
      );
    });

  };

  onPopulateBarChart = () => {
    let datasets = this.state.datasets;
    let data = [
      this.state.smartPhoneCount,
      this.state.featurePhoneCount,
      this.state.accessoryCount,
    ];

    datasets[0].data = data;

    this.setState({ datasets });
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
