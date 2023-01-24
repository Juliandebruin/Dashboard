import * as d3 from 'd3';

export function degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

export function scale(value: number, to: number): number {
	const sl = d3.scaleLinear().range([0, 1]).domain([0, to]);
	return sl(value);
}