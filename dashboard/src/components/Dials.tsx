import React from "react";
import RPMGauge from "./RPMGauge";
import SpeedGauge from "./Speedgauge";
import cssClasses from './css/DisplayGauge.module.css';

interface MyState {
	rpm: number;
	speed: number;
	acceleratingSpeed: boolean;
	acceleratingRpm: boolean;
}

class Dials extends React.Component <{}, MyState> {
	intervalFunction: NodeJS.Timer | null = null;

	constructor(props: any) {
		super(props);
		this.state = { 
			rpm: 0,
			speed: 0,
			acceleratingRpm: false,
			acceleratingSpeed: false 
		};
	}

	changeRpmDial() {
		if (this.state.rpm >= 6000) {
			this.setState({ acceleratingRpm: false });
		} else if (this.state.rpm <= 0) {
			this.setState({ acceleratingRpm: true });
		}

		if (this.state.acceleratingRpm) {
			this.setState({ rpm: this.state.rpm + 45 });
		} else {
			this.setState({ rpm: this.state.rpm - 45 });
		}
	}

	changeSpeedDial() {
		if (this.state.speed === 300) {
			this.setState({ acceleratingSpeed: false });
		} else if (this.state.speed === 0) {
			this.setState({ acceleratingSpeed: true });
		}

		if (this.state.acceleratingSpeed) {
			this.setState({ speed: this.state.speed + 1 });
		} else {
			this.setState({ speed: this.state.speed - 1 });
		}
	}

	componentDidMount() {
		this.intervalFunction = setInterval(() => {
			this.changeRpmDial();
			this.changeSpeedDial();
		}, 25);
	}
	
	render() {
		return (
			<div className={cssClasses.layoutDiv}>
				<div className={cssClasses.dialLeft }><RPMGauge   rpm   = {this.state.rpm  }/></div>
				<div className={cssClasses.dialRight}><SpeedGauge speed = {this.state.speed}/></div>
			</div>
		);
	}
}

export default Dials;