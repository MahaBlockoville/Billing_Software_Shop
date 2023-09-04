import React, { Component } from "react";
import "toasted-notes/src/styles.css";
import "../../assets/billTemplate.css";

class ReportTemplate extends Component {
  constructor() {
    super();
    this.state = {
      ...this.props,
    };
  }

  render() {
    const styles = {
      page: {
        marginLeft: "2rem",
        marginRight: "2rem",
        "page-break-after": "always",
        width: "30%",
      },

      columnLayout: {
        display: "flex",
        justifyContent: "space-between",
      },

      column: {
        display: "flex",
        flexDirection: "column",
      },

      spacer2: {
        height: "1rem",
      },

      fullWidth: {
        width: "30%",
      },

      marginb0: {
        marginBottom: 0,
      },
    };
    return (
      <>
        <div style={styles.page}>
          <div>
            <h1 style={styles.introText}>{this.props.branch}</h1>
          </div>
        </div>

        <table className="table table_bill" style={styles.page}>
          <thead>
            <th>Bill Statement</th>
            <th></th>
          </thead>
          <tbody>
            <tr>
              <td>Customer Name</td>
              <td>{this.props.name}</td>
            </tr>
            <tr>
              <td>Customer Email</td>
              <td>{this.props.email}</td>
            </tr>
            <tr>
              <td>Customer Phone</td>
              <td>{this.props.phone}</td>
            </tr>
            {this.props.inward !== undefined &&
              this.props.inward.product !== undefined && (
                <tr>
                  <td>Brand Detail</td>
                  <td>
                    {this.props.inward.product.name} -{" "}
                    {this.props.inward.product.model}-{" "}
                    {this.props.inward.product.variant} -{" "}
                    {this.props.inward.product.color}
                  </td>
                </tr>
              )}
            <tr>
              <td>IMEI Number</td>
              <td>{this.props.imei_number}</td>
            </tr>
            <tr>
              <td>Payment Type</td>
              <td>{this.props.payment_type}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>{this.props.selling_value}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}

export default ReportTemplate;
