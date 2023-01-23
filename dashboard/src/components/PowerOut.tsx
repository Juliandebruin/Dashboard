import React from "react";
import * as d3 from 'd3';

import PowerOutPng from '../assets/power-out.png';

interface MyProps {
	power: number;
};

class PowerOut extends React.Component <MyProps, {}>{
	renderd  : boolean = false;
	poutRef  : React.RefObject<HTMLInputElement>;
	power   !: d3.Selection<SVGTextElement , unknown, null, undefined>;
	poutImg !: d3.Selection<SVGImageElement, unknown, null, undefined>;

	constructor(props: MyProps) {
		super(props);
		this.poutRef = React.createRef();
	}

	componentDidMount() {
		if (this.renderd) {
			return;
		}

        const svgImage = d3.select(this.poutRef.current).append('svg').attr('width', `275px`).attr('height', `75px`);
		this.poutImg = svgImage.append('image')
			.attr('xlink:href', PowerOutPng)
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
        return <div ref={this.poutRef}/>;
    }
}

export default PowerOut;