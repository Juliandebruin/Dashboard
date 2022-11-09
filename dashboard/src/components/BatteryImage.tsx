import React from "react";
import * as d3 from 'd3';

class CustomSpeedGauge extends React.Component <{}, {}>{
	renderd: boolean = false;
	batteryImageRef: React.RefObject<HTMLInputElement>;
	batteryImage: d3.Selection<SVGImageElement, unknown, null, undefined> | undefined;

	constructor(props: {}) {
		super(props);
		this.batteryImageRef  = React.createRef();
	}

	componentDidMount() {
		if (this.renderd) {
			return;
		}

        const svgImage = d3.select(this.batteryImageRef.current).append('svg').attr('width', `300px`).attr('height', `145px`);
		this.batteryImage = svgImage.append('image')
			.attr('xlink:href', 'http://cdn.onlinewebfonts.com/svg/img_45840.png')
			.attr('width', 300)
			.attr('height', 145);

        this.renderd = true;
    }

    render() {
        return <div ref={this.batteryImageRef}/>;
    }
}

export default CustomSpeedGauge;