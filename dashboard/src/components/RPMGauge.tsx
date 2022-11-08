import React from "react";
import * as d3 from 'd3';
import { degToRad, scale } from "../utils/circleUtils";

interface RpmGaugeProps {
	rpm: number;
};

class RPMGauge extends React.Component <RpmGaugeProps, {}>{
    renderd: boolean = false;
	myRef: React.RefObject<HTMLInputElement>;
	needle!: d3.Selection<SVGPathElement, number[][], null, undefined>;
    rpmText!: d3.Selection<SVGTextElement, unknown, null, undefined>;

	constructor(props: RpmGaugeProps) {
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
            { value: 0 },
            { value: 10 },
            { value: 20 },
            { value: 30 },
            { value: 40 },
            { value: 50 },
            { value: 60 },
            { value: 70 },
            { value: 80 }
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
        const maxAngle = 90;
        const angleRange = maxAngle - minAngle;

        const ticks = ticksData
            .reduce((acc, current, index) => {
                if (current.value === 0) {
                    return acc;
                } else {
                    return acc.concat(d3.range(current.value - 10, current.value + 10));
                }
            }, [] as number[])
            .filter((d: number) => d % 2 === 0 && d <= 80);

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
            .attr('y2', (d: number) => (d % 5 === 0 ? `${lengthLongTicks}` : `${lengthShortTicks}`))
            .attr('transform', (d: number) => {
                const scale = d3.scaleLinear().range([0, 1]).domain([0, 80]);
                const ratio = scale(d);
                const newAngle = minAngle + ratio * angleRange;
                const deviation = d % 5 === 0 ? paddindToOuterCircleShortTicks : paddindToOuterCircleLongTicks;
                return `rotate(${newAngle}) translate(0, ${deviation - radius})`;
            })
            .style('stroke', (d: number) => (d >= 70 ? colors[3] : colors[2]))
            .style('stroke-width', (d: number) => (d % 5 === 0 ? `${widthAllTicks}` : '1'));

        const fontSizeNumbers = 50;
        const paddingumbersToOuterCircle = 110;
        
        // tick texts
        lg.selectAll('text')
            .data(ticksData)
            .enter()
            .append('text')
            .attr('transform', (d: { value: number }) => {
                const scale = d3.scaleLinear().range([0, 1]).domain([0, 80]);
                const ratio = scale(d.value);
                const newAngle = degToRad(minAngle + ratio * angleRange);
                const y = (paddingumbersToOuterCircle - radius) * Math.cos(newAngle);
                const x = -1 * (paddingumbersToOuterCircle - radius) * Math.sin(newAngle);
                return `translate(${x}, ${y + 7})`;
            })
            .text((d: { value: number }) => (d.value !== 0 ? d.value / 10 : ''))
            .attr('fill', (d: { value: number }) => (d.value >= 70 ? colors[3] : colors[2]))
            .attr('font-size', `${fontSizeNumbers}`)
            .attr('text-anchor', 'middle');

        // needle
        const needleLine = d3.line();
        const pointerHeadLength = radius * 0.88;
        const lineData = [
            [0, -pointerHeadLength],
            [0,                 15]
        ];

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

        // big text in center
        tg.append('text')
            .text('D3')
            .attr('font-size', '80')
            .attr('text-anchor', 'middle')
            .attr('fill', colors[2])
            .attr('x', '0')
            .attr('y', '0px')
            .style('position', 'absolute')
            .style('z-index', '10');

        // rpm x 1000 text
        tg.append('text')
            .text('1/min x 1000')
            .attr('font-size', '50')
            .attr('text-anchor', 'middle')
            .attr('fill', colors[2])
            .attr('x', '0')
            .attr('y', '110px')
            .style('position', 'absolute')
            .style('z-index', '10');

        // lights icon
        tg.append('image')
            .attr('xlink:href', '/assets/images/lights.svg')
            // .attr('x', '0px')
            // .attr('y', '340px')
            .attr('width', '35px')
            .attr('height', '35px');

        // seat belt icon
        tg.append('image')
            .attr('xlink:href', '/assets/images/seat-belt.svg')
            .attr('x', '56px')
            .attr('y', '120px')
            .attr('width', '30px')
            .attr('height', '30px');

        // rear window defrost icon
        tg.append('image')
            .attr('xlink:href', '/assets/images/rear-window-defrost.svg')
            .attr('x', '95px')
            .attr('y', '95px')
            .attr('width', '30px')
            .attr('height', '30px');

        this.renderd = true;
    }

    componentDidUpdate(): void {
		if (!this.needle) {
			return;
		}
	  
        const refreshRate = 10;
		const minAngle = -160;
        const maxAngle = 90;
        const angleRange = maxAngle - minAngle;
        const angle = minAngle + scale(this.props.rpm, 6000) * angleRange;

        d3.transition()
            .select(() => this.needle.node())
            .duration(refreshRate)
            .ease(d3.easeCubicInOut)
            .attr('transform', `rotate(${angle})`);
	}

    render() {
        return <div ref={this.myRef}/>;
    }
}

export default RPMGauge;