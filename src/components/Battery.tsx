import React from "react";
import * as d3 from 'd3';
import cssClasses from './css/Battery.module.css';

import BatteryPng from '../assets/battery.png';

interface BatteryProps {
	percentage: number;
};

class Battery extends React.Component <BatteryProps, {}>{
	renderd: boolean = false;
	batteryImageRef: React.RefObject<HTMLInputElement>;
	batteryInsideRef: React.RefObject<HTMLInputElement>;
	batteryImage: d3.Selection<SVGImageElement, unknown, null, undefined> | undefined;
	batteryInside: d3.Selection<SVGRectElement, unknown, null, undefined> | undefined;

	constructor(props: BatteryProps) {
		super(props);
		this.batteryImageRef  = React.createRef();
		this.batteryInsideRef = React.createRef();
	}

	componentDidMount() {
		if (this.renderd) {
			return;
		}

        const svgImage = d3.select(this.batteryImageRef.current).append('svg').attr('width', `300px`).attr('height', `145px`);
		this.batteryImage = svgImage.append('image')
			.attr('xlink:href', BatteryPng)
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 300)
			.attr('height', 145);

		const svgRectangle = d3.select(this.batteryInsideRef.current).append('svg').attr('width', `220px`).attr('height', `80px`);
		this.batteryInside = svgRectangle.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr("rx", 10)
			.attr('width', 100)
			.attr('height', 80)
			.attr('fill', '#D60606');

        this.renderd = true;
    }

	componentDidUpdate(): void {
		if (!this.batteryInside) {
			return;
		}

		const refreshRate = 10;
		let fillColour = '';

		if (this.props.percentage < 20) {
			// Red
			fillColour = '#D60606';
		} else if (this.props.percentage < 40) {
			// Orange
			fillColour = '#EB6009';
		} else {
			// Green
			fillColour = '#32CD32';
		}

		d3.transition()
			.select(() => this.batteryInside!.node())
			.duration(refreshRate)
            .ease(d3.easeCubicInOut)
			.transition()
			.attr('fill', fillColour)
			.attr("width", `${this.props.percentage*2.2}px`);
	}

    render() {
		return <div>
			<div className={cssClasses.batteryImage } ref={this.batteryImageRef }/>
			<div className={cssClasses.batteryInside} ref={this.batteryInsideRef}/>
		</div>
    }
}

export default Battery;