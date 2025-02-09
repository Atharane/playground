
"use client";

import { CalendarSync } from "lucide-react";
import type React from "react";
import { useRef, useEffect, useState } from "react";

export default function DrawingBoard() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const [isTracing, setIsTracing] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.lineWidth = 2;
				ctx.lineCap = "round";
				ctx.strokeStyle = "black";
			}
		}
	}, []);

	const startTracing = () => {
		if (isTracing) return;
		setIsTracing(true);

		const svgElement = svgRef.current;
		if (!svgElement) return;

		// get all path and circle elements inside the svg
		const drawableElements = svgElement.querySelectorAll("path, circle");
		if (drawableElements.length === 0) {
			console.error("no drawable elements found in svg");
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!ctx || !canvas) return;

		// clear previous drawings
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// debug: log svg viewbox and elements
		console.log("svg viewbox:", svgElement.getAttribute("viewBox"));
		console.log("number of drawable elements:", drawableElements.length);
		drawableElements.forEach((el, i) => {
			if (el.tagName.toLowerCase() === "path") {
				console.log(`path ${i} d attribute:`, el.getAttribute("d"));
			} else if (el.tagName.toLowerCase() === "circle") {
				const circle = el as SVGCircleElement;
				console.log(
					`circle ${i} cx: ${circle.cx.baseVal.value}, cy: ${circle.cy.baseVal.value}, r: ${circle.r.baseVal.value}`
				);
			}
		});

		let currentElementIndex = 0;

		const traceElement = () => {
			if (currentElementIndex >= drawableElements.length) {
				setIsTracing(false);
				return;
			}

			const element = drawableElements[currentElementIndex];
			let pathLength = 0;
			let getPointAtLength: (length: number) => DOMPoint | null = () => null;

			if (element.tagName.toLowerCase() === "path") {
				const pathElement = element as SVGPathElement;
				pathLength = pathElement.getTotalLength();
				getPointAtLength = (length: number) => pathElement.getPointAtLength(length);
			} else if (element.tagName.toLowerCase() === "circle") {
				// approximate circle as a path with same circumference
				const circle = element as SVGCircleElement;
				pathLength = 2 * Math.PI * circle.r.baseVal.value;
				getPointAtLength = (length: number) => {
					const angle = (length / pathLength) * 2 * Math.PI;
					const x = circle.cx.baseVal.value + circle.r.baseVal.value * Math.cos(angle);
					const y = circle.cy.baseVal.value + circle.r.baseVal.value * Math.sin(angle);
					return new DOMPoint(x, y);
				};
			} else {
				// unsupported element, skip
				currentElementIndex++;
				traceElement();
				return;
			}

			const steps = 200;
			const duration = 1000;
			const interval = duration / steps;

			let i = 0;
			ctx.beginPath();

			const intervalId = setInterval(() => {
				if (i > steps) {
					clearInterval(intervalId);
					currentElementIndex++;
					traceElement();
					return;
				}

				const point = getPointAtLength((i / steps) * pathLength);
				if (!point) {
					clearInterval(intervalId);
					currentElementIndex++;
					traceElement();
					return;
				}

				// get svg and canvas dimensions for proper scaling
				const svgRect = svgElement.getBoundingClientRect();
				const scaleX = canvas.width / svgRect.width;
				const scaleY = canvas.height / svgRect.height;
				const scale = Math.min(scaleX, scaleY) * 0.5; // use 50% of available space

				const x = point.x * scale + canvas.width / 2 - 12 * scale; // center based on viewBox
				const y = point.y * scale + canvas.height / 2 - 12 * scale;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
					ctx.stroke();
				}

				i++;
			}, interval);
		};

		traceElement();
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-2xl font-bold mb-4">Drawing Board</h1>
			<canvas
				ref={canvasRef}
				width={800}
				height={600}
				className="border border-gray-300 bg-white"
			/>
			<button
				type="button"
				onClick={startTracing}
				className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
			>
				trace icon
			</button>
			<svg ref={svgRef} width="50" height="50" viewBox="0 0 24 24">
				<title>star</title>
				<CalendarSync />
			</svg>
		</div>
	);
}
