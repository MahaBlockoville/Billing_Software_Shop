import React, { Component } from "react";
import "toasted-notes/src/styles.css";

class ReportTemplate extends Component {
  constructor() {
    super();
    this.state = {
        ...this.props
    }
};


render() {
    const styles = {
		page: {
			marginLeft: '5rem',
			marginRight: '5rem',
			'page-break-after': 'always',
		},

		columnLayout: {
			display: 'flex',
			justifyContent: 'space-between',
			margin: '3rem 0 5rem 0',
			gap: '2rem',
		},

		column: {
			display: 'flex',
			flexDirection: 'column',
		},

		spacer2: {
			height: '2rem',
		},

		fullWidth: {
			width: '100%',
		},

		marginb0: {
			marginBottom: 0,
		},
	};
	return (
		<>
			<div style={styles.page}>
				<div>
					<h1 style={styles.introText}>
						Sales Bill
					</h1>
				</div>

				<div style={styles.spacer2}></div>

			</div>

			<div style={styles.page}>

				<div style={styles.columnLayout}>
					<div style={styles.column}>
						<h4 style={styles.marginb0}>Customer Name</h4>
						<p>
                            {this.props.name}
						</p>
					</div>

					<div style={styles.column}>
						<h4 style={styles.marginb0}>Customer Email</h4>
						<p>
                            {this.props.email}
						</p>
					</div>
                    <div style={styles.column}>
						<h4 style={styles.marginb0}>Customer Address</h4>
						<p>
                            {this.props.address}
						</p>
					</div>
                    <div style={styles.column}>
						<h4 style={styles.marginb0}>Customer Phone</h4>
						<p>
                            {this.props.phone}
						</p>
					</div>
                    <div style={styles.column}>
						<h4 style={styles.marginb0}>Branch Name</h4>
						<p>
                            {this.props.branch}
						</p>
					</div>
				</div>

				<div style={styles.columnLayout}>
                    {
                        this.props.inward !== undefined && this.props.inward.product !== undefined && 
                        <div style={styles.column}>
						<h4 style={styles.marginb0}>Brand Detail</h4>
						<p>
                            {this.props.inward.product.name}  - {this.props.inward.product.model} 
                            - {this.props.inward.product.variant} - {this.props.inward.product.color}
						</p>
					</div>
                    }

					<div style={styles.column}>
						<h4 style={styles.marginb0}>IMEI Number</h4>
						<p>
                            {this.props.imei_number}
						</p>
					</div>
                    <div style={styles.column}>
						<h4 style={styles.marginb0}>Payment Type</h4>
						<p>
                            {this.props.payment_type}
						</p>
					</div>
					<div style={styles.column}>
						<h4 style={styles.marginb0}>Amount</h4>
						<p>
                            {this.props.selling_value}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};
};

export default ReportTemplate;
