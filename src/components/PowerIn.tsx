import React from "react";
import * as d3 from 'd3';

import PowerInPng from '../assets/power-in.png';

interface MyProps {
	power: number;
};

class PowerIn extends React.Component <MyProps, {}>{
	renderd : boolean = false;
	pinRef  : React.RefObject<HTMLInputElement>;
	power  !: d3.Selection<SVGTextElement , unknown, null, undefined>;
	pinImg !: any;

	constructor(props: MyProps) {
		super(props);
		this.pinRef  = React.createRef();
	}

	componentDidMount() {
		if (this.renderd) {
			return;
		}

        const svgImage = d3.select(this.pinRef.current).append('svg').attr('width', `275px`).attr('height', `75px`);
		this.pinImg = svgImage.append('image')
			.attr('xlink:href', PowerInPng)
			.attr('width' , '100%')
			.attr('height', '100%')
			.attr("x", -100)
			.attr("y", 0);

		this.power = svgImage.append("text")
			.text(this.props.power + " W")
			.attr("x", 100)
			.attr("y", 50)
			.attr('font-size', '50')
			.attr('fill', '#FFFFFF');

        this.renderd = true;
    }

	componentDidUpdate(): void {
		this.power.text(this.props.power + " W");
	}

    render() {
        return <div ref={this.pinRef}/>;
    }
}

export default PowerIn;