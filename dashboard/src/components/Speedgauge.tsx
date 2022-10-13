import React from "react";
import * as d3 from 'd3';
import { degToRad, scale } from "./circleUtils";
import cssClasses from './css/SpeedGauge.module.css';

interface SpeedGaugeProps {
	speed: number;
};

class SpeedGauge extends React.Component<SpeedGaugeProps, {}> {
	renderd: boolean = false;
	myRef: React.RefObject<HTMLInputElement>;
	needle!: d3.Selection<SVGPathElement, number[][], null, undefined>;
    speedText!: d3.Selection<SVGTextElement, unknown, null, undefined>;

	constructor(props: SpeedGaugeProps) {
		super(props);
		this.myRef = React.createRef();
	}

	componentDidMount() {
		if (this.renderd) {
			return;
		}

		const dialRadius = 450;

		const svg = d3.select(this.myRef.current).append('svg').attr('width', `${dialRadius*2}px`).attr('height', `${dialRadius*2}px`);
        const g = svg.append('g').attr('transform', `translate(${dialRadius}, ${dialRadius})`);

        const colors = ['#D1D1D1', '#AFAFAF', '#FFFFFF', '#FD3104', '#171717', '#0A0A0A'];
        const ticksData = [
            { value: 0  , visible: false, color: '#FFFFFF' },
            { value: 20 , visible: false, color: '#FFFFFF' },
            { value: 30 , visible: false, color: '#FD3104' },
            { value: 40 , visible: false, color: '#FFFFFF' },
            { value: 50 , visible: false, color: '#FD3104' },
            { value: 60 , visible: false, color: '#FFFFFF' },
            { value: 80 , visible: false, color: '#FFFFFF' },
            { value: 100, visible: false, color: '#FFFFFF' },
            { value: 120, visible: false, color: '#FFFFFF' },
            { value: 140, visible: false, color: '#FFFFFF' },
            { value: 160, visible: false, color: '#FFFFFF' },
            { value: 180, visible: false, color: '#FFFFFF' },
            { value: 200, visible: false, color: '#FFFFFF' },
            { value: 220, visible: false, color: '#FFFFFF' },
            { value: 240, visible: false, color: '#FFFFFF' },
            { value: 260, visible: false, color: '#FFFFFF' },
            { value: 280, visible: false, color: '#FFFFFF' },
            { value: 300, visible: false, color: '#FFFFFF' }
        ];

        const radius = dialRadius; // width / 2

		// gradients
		const defs = svg.append('defs');

		const gradient = defs
			.append('linearGradient')
			.attr('id', 'gradient1')
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '50%')
			.attr('y2', '100%');
		gradient.append('stop').attr('offset', '50%').attr('stop-color', colors[4]).attr('stop-opacity', 1);
		gradient.append('stop').attr('offset', '100%').attr('stop-color', colors[5]).attr('stop-opacity', 1);
	
		// outer circle
		const outerRadius = radius - 10;
		const innerRadius = 0;
	
		const circle = d3.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius)
			.startAngle(0)
			.endAngle(2 * Math.PI);
	
		g.append('path')
			.attr('d', circle as any)
			.attr('fill', 'url(#gradient1)')
			.attr('stroke', colors[1])
			.attr('stroke-width', '7');
	
		// ticks
		const lg = svg.append('g').attr('class', 'label').attr('transform', `translate(${radius}, ${radius})`);
		const minAngle = -160;
		const maxAngle = 150;
		const angleRange = maxAngle - minAngle;
	
		const ticks = ticksData
		  	.reduce((prevValue, currVal, index) => {
				if (currVal.value === 0) {
					return [0, 1, 2, 3, 4, 5];
				} else {
					return prevValue.concat(d3.range(currVal.value - 10, currVal.value + 10));
				}
		  	}, [] as number[])
		  	.filter((d: number) => d % 5 === 0 && d <= 300);

		const widthAllTicks    = 5;
		const lengthShortTicks = 27;
		const lengthLongTicks  = 50;
		const paddindToOuterCircleShortTicks = 12;
		const paddindToOuterCircleLongTicks  = 35;
		
		lg.selectAll('line')
			.data(ticks)
			.enter()
			.append('line')
			.attr('class', 'tickline')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', (d: number) => (d % 20 === 0 || d === 0 ? `${lengthLongTicks}` : `${lengthShortTicks}`))
			.attr('transform', (d: number) => {
				const ratio = scale(d, 300);
				const newAngle = minAngle + ratio * angleRange;
				const deviation = d % 20 === 0 || d === 0 ? paddindToOuterCircleShortTicks : paddindToOuterCircleLongTicks;
				return `rotate(${newAngle}) translate(0, ${deviation - radius})`;
			})
			.style('stroke', (d: number) => (d === 30 || d === 50 ? colors[3] : colors[2]))
			.style('stroke-width', (d: number) => (d % 5 === 0 || d === 0 ? `${widthAllTicks}` : '1'));
	
		const paddingLowNumbersToOuterCircle = 100;
		const paddingHighNumbersToOuterCircle = 110;
		const fontSizeRedNumbers = 30;
		const fontSizeWhiteNumbers = 40;

		// ticks text
		lg.selectAll('text')
			.data(ticksData)
			.enter()
			.append('text')
			.attr('transform', (d: { value: number; color: string }) => {
				const ratio = scale(d.value, 300);
				const newAngle = degToRad(minAngle + ratio * angleRange);
				const deviation = (d.value < 100 ? paddingLowNumbersToOuterCircle : paddingHighNumbersToOuterCircle);
				const y = (deviation - radius) * Math.cos(newAngle);
				const x = -1 * (deviation - radius) * Math.sin(newAngle);
				return `translate(${x}, ${y + 7})`;
			})
			.text((d: { value: number; color: string }) => (d.value !== 0 ? d.value : ''))
			.attr('fill', (d: { value: number; color: string }) => d.color)
			.attr('font-size', (d: { value: number; color: string }) => {
				return d.value === 30 || d.value === 50 ? `${fontSizeRedNumbers}` : `${fontSizeWhiteNumbers}`;
			})
			.attr('text-anchor', 'middle');
	
		// needle
		const pointerHeadLength = radius * 0.88;
		const lineData = [
			[0, -pointerHeadLength],
			[0, 				15]
		];
		const needleLine = d3.line();
		const ng = svg
			.append('g')
			.data([lineData])
			.attr('class', 'pointer')
			.attr('stroke', colors[3])
			.attr('stroke-width', '10')
			.attr('stroke-linecap', 'round')
			.attr('transform', `translate(${radius}, ${radius})`)
			.attr('z-index', '1');
	
		this.needle = ng.append('path').attr('d', needleLine as any).attr('transform', `rotate(${-160})`);
	
		// inner circle
		const tg = svg.append('g').attr('transform', `translate(${radius}, ${radius})`);
	
		const innerArcOuterRadius = radius - 170;
		const innerArcInnerRadius = 0;
	
		const innerArc = d3.arc()
			.innerRadius(innerArcInnerRadius)
			.outerRadius(innerArcOuterRadius)
			.startAngle(0)
			.endAngle(2 * Math.PI);
	
		tg.append('path')
			.attr('d', innerArc as any)
			.attr('stroke', colors[0])
			.attr('stroke-width', '2')
			.attr('fill', 'url(#gradient1)')
			.attr('z-index', '10');
	
		// speed text in center
		this.speedText = tg
			.append('text')
			.text('0')
			.attr('font-size', '80')
			.attr('text-anchor', 'middle')
			.attr('fill', colors[2])
			.attr('x', '0')
			.attr('y', '25px')
			.style('position', 'absolute')
			.style('z-index', '10');
	
		// km/h text
		tg.append('text')
			.text('km/h')
			.attr('font-size', '50')
			.attr('text-anchor', 'middle')
			.attr('fill', colors[2])
			.attr('x', '0')
			.attr('y', '110px')
			.style('position', 'absolute')
			.style('z-index', '10');

		this.setValue(0);

		this.renderd = true;
	}

	setValue = (value: number) => {
		const refreshRate = 10;
		const minAngle = -160;
		const maxAngle = 150;
		const angleRange = maxAngle - minAngle;
		const angle = minAngle + scale(value, 300) * angleRange;
	
		this.speedText.text(value);
	
		d3.transition()
			.select(() => this.needle.node())
			.duration(refreshRate)
			.ease(d3.easeCubicInOut)
			.attr('transform', `rotate(${angle})`);
	}

	componentDidUpdate(): void {
		if (!this.needle) {
			return;
		}
	  
		this.setValue(this.props.speed);
	}

	render() {
		return <div className={cssClasses.dial} ref={this.myRef}/>;
	}
}

export default SpeedGauge;
