import axios from "axios";
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

export default class BarChart extends Component {
  constructor() {
    super();

    this.state = {
      saleList: [],
      labels: [],
      datasets: [
        {
          label: "sale count",
          backgroundColor: "#b3d1ff",
          borderColor: "#0066ff",
          borderWidth: 2,
          data: [],
        },
      ],
    };
  }

  componentDidMount = async () => {
    axios.get("/api/admin/getSalesList").then((saleList) => {
      this.setState({ saleList: saleList.data }, () => {
        this.onPopulateBarChart();
      });
    });
  };

  onPopulateBarChart = () => {
    //   no of emp per team
    let teamDict = {};

    this.state.saleList.forEach((emp) => {
      if (!teamDict[emp.branch]) {
        teamDict[emp.branch] = 1;
      } else {
        teamDict[emp.branch]++;
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
              text: "No. of sales per team",
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
