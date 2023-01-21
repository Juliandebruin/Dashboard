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

	requestData() {
		if (this.state.connected) {
			console.log('Requesting data...');
			socket.emit('request_data', {}, (data: any) => {
				console.log("Requested data: ", data);
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
		this.intervalFunction = setInterval(() => this.requestData(), 1000);
	}

	componentDidUpdate() {
		console.log("Updating...");
		console.log("RPM: ", this.state.rpm);
		console.log("Speed: ", this.state.speed);
		console.log("Battery: ", this.state.percentage);
		console.log("Pin: ", this.state.pin);
		console.log("Pout: ", this.state.pout);
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