import React from "react";
import io from 'socket.io-client';
import cssClasses from './css/Layout.module.css';

import RPMGauge from "./RPMGauge";
import CustomSpeedGauge from "./CustomSpeedGauge";
import Battery from "./Battery";
import PowerIn from "./PowerIn";
import PowerOut from "./PowerOut";

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
			percentage: 0,
			pin: 0,
			pout: 0,
			connected: false,
			acceleratingRpm: false,
			acceleratingSpeed: false,
			increasingPercentage: false
		};
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
				try {
					data = JSON.parse(data);
					this.setState({
						rpm        : (data.rpm 	   !== undefined ? +data.rpm 	 : this.state.rpm		),
						speed      : (data.speed   !== undefined ? +data.speed 	 : this.state.speed	    ),
						percentage : (data.battery !== undefined ? +data.battery : this.state.percentage),
						pin		   : (data.pin 	   !== undefined ? +data.pin 	 : this.state.pin		),
						pout	   : (data.pout    !== undefined ? +data.pout 	 : this.state.pout	    )
					});
				}
				catch (e) {
					console.log('Error parsing data');
				}
			});		
		} else {
			console.log('Not connected');
		}
	}

	componentDidMount() {
		this.setUpSocketIo();
		this.intervalFunction = setInterval(() => this.requestData(), 1000);
	}

	componentDidUpdate() {
		console.log(
			`Updating...\n`						  +
			`RPM:     ${this.state.rpm       }\n` +
			`Speed:   ${this.state.speed     }\n` +
			`Battery: ${this.state.percentage}\n` +
			`Pin:     ${this.state.pin       }\n` +
			`Pout:    ${this.state.pout      }\n` 
		);
	}

	componentWillUnmount() {
		if (this.intervalFunction !== null) {
			clearInterval(this.intervalFunction);
		}
	}
	
	render() {
		return (
			<div>
				<div className={cssClasses.powerIn 	}><PowerIn			power 	   = {this.state.pin	   }/></div>
				<div className={cssClasses.powerOut	}><PowerOut			power 	   = {this.state.pout	   }/></div>
				<div className={cssClasses.battery  }><Battery      	percentage = {this.state.percentage}/></div>
				<div className={cssClasses.dialRight}><RPMGauge 	 	rpm 	   = {this.state.rpm	   }/></div>
				<div className={cssClasses.dialLeft }><CustomSpeedGauge speed 	   = {this.state.speed	   }/></div>
			</div>
		);
	}
}

export default DasboardContent;