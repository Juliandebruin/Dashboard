import React from "react";
import MyD3Component from "./Speedgauge";

interface MyState {
	speed: number;
	accelerating: boolean;
}

class DisplayGauge extends React.Component <{}, MyState> {
	intervalFunction: NodeJS.Timer | null = null;

	constructor(props: any) {
		super(props);
		this.state = { speed: 0, accelerating: false };
	}

	componentDidMount() {
		console.log('mounted');
		this.intervalFunction = setInterval(() => {
			if (this.state.speed === 300) {
				this.setState({ accelerating: false });
			} else if (this.state.speed === 0) {
				this.setState({ accelerating: true });
			}

			if (this.state.accelerating) {
				this.setState({ speed: this.state.speed + 1 });
			} else {
				this.setState({ speed: this.state.speed - 1 });
			}
		}, 25);
	}
	
	render() {
		return (
			<div>
				<h1>Gauge Example</h1>
				<MyD3Component speed={this.state.speed} />
			</div>
		);
	}
}

export default DisplayGauge;