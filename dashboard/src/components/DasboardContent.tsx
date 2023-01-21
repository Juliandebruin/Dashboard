import React from "react";
import BatteryImage from "./BatteryImage";
import BatteryInside from "./BatteryInside";
import RPMGauge from "./RPMGauge";
import CustomSpeedGauge from "./CustomSpeedGauge";
import cssClasses from './css/Layout.module.css';

import io from 'socket.io-client';

const socket = io();

interface MyState {
	rpm: number;
	speed: number;
	percentage: number;
	pin: number;
	pout: number;
	connected: boolean;
	acceleratingSpeed: boolean;
	acceleratingRpm: boolean;
	increasingPercentage: boolean;
}

class DasboardContent extends React.Component <{}, MyState> {
	intervalFunction: NodeJS.Timer | null = null;

	constructor(props: any) {
		super(props);
		this.state = { 
			rpm: 0,
			speed: 0,
			percentage: 10,
			pin: 0,
			pout: 0,
			connected: false,
			acceleratingRpm: false,
			acceleratingSpeed: false,
			increasingPercentage: false
		};
	}

	check(value: number) {
		return (isNaN(value) ? 0 : value);
	}

	setUpSocketIo() {
		socket.on('connect', () => {
			this.setState({connected: true});
			console.log('connected');
		});
	
		socket.on('disconnect', () => {
			this.setState({connected: false });
			console.log('disconnected');
		});
	}

	changeRpmDial() {
		if (this.state.rpm >= 8000) {
			this.setState({ acceleratingRpm: false });
		} else if (this.state.rpm <= 0) {
			this.setState({ acceleratingRpm: true });
		}

		if (this.state.acceleratingRpm) {
			this.setState({ rpm: this.state.rpm + 50 });
		} else {
			this.setState({ rpm: this.state.rpm - 50 });
		}
	}

	changeSpeedDial() {
		if (this.state.speed === 80) {
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

	changeBatteryPercentage() {
		if (this.state.percentage >= 100) {
			this.setState({ increasingPercentage: false });
		} else if (this.state.percentage <= 10) {
			this.setState({ increasingPercentage: true });
		}

		if (this.state.increasingPercentage) {
			this.setState({ percentage: this.state.percentage + 0.3 });
		} else {
			this.setState({ percentage: this.state.percentage - 0.3 });
		}
	}

	requestData() {
		if (this.state.connected) {
			console.log('Requesting data...');
			socket.emit('request_data', null, (data: any) => {
				this.setState({
					rpm: this.check(data.rpm),
					speed: this.check(data.speed),
					percentage: this.check(data.battery),
					pin: this.check(data.pin),
					pout: this.check(data.pout)
				});
			});		
		}
	}

	componentDidMount() {
		this.setUpSocketIo();
		this.intervalFunction = setInterval(this.requestData, 1000);
	}

	componentDidUpdate() {
		console.log(this.state);
	}

	componentWillUnmount() {
		if (this.intervalFunction !== null) {
			clearInterval(this.intervalFunction);
		}
	}
	
	render() {
		return (
			<div className={cssClasses.layoutDiv}>
				<div className={cssClasses.batteryImage }><BatteryImage											/></div>
				<div className={cssClasses.batteryInside}><BatteryInside 	percentage = {this.state.percentage}/></div>
				<div className={cssClasses.dialRight	}><RPMGauge 	 	rpm 	   = {this.state.rpm	   }/></div>
				<div className={cssClasses.dialLeft 	}><CustomSpeedGauge speed 	   = {this.state.speed	   }/></div>
			</div>
		);
	}
}

export default DasboardContent;