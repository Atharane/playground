"use client";

import { CalendarSync } from "lucide-react";
import type React from "react";
import { useRef, useEffect, useState } from "react";

export default function DrawingBoard() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const [isTracing, setIsTracing] = useState(false);

	// state for dragging the selection box
	const [isDragging, setIsDragging] = useState(false);
	const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [currentPoint, setCurrentPoint] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [selectionBox, setSelectionBox] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);

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

		// handle mouse down event to start dragging
		const handleMouseDown = (e: MouseEvent) => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			setIsDragging(true);
			setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
		};

		// handle mouse move event to update current point
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging || !startPoint) return;
			const canvas = canvasRef.current;
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			setCurrentPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
		};

		// handle mouse up event to finalize the selection box
		const handleMouseUp = () => {
			if (isDragging && startPoint && currentPoint) {
				const x = Math.min(startPoint.x, currentPoint.x);
				const y = Math.min(startPoint.y, currentPoint.y);
				const width = Math.abs(currentPoint.x - startPoint.x);
				const height = Math.abs(currentPoint.y - startPoint.y);
				setSelectionBox({ x, y, width, height });
			}
			setIsDragging(false);
			setStartPoint(null);
			setCurrentPoint(null);
		};

		canvas?.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			canvas?.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, startPoint, currentPoint]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// clear canvas before redrawing
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// redraw the selection box while dragging
		if (isDragging && startPoint && currentPoint) {
			ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
			ctx.strokeRect(
				Math.min(startPoint.x, currentPoint.x),
				Math.min(startPoint.y, currentPoint.y),
				Math.abs(currentPoint.x - startPoint.x),
				Math.abs(currentPoint.y - startPoint.y),
			);
		}

		// draw the finalized selection box
		if (selectionBox) {
			ctx.strokeStyle = "blue";
			ctx.strokeRect(
				selectionBox.x,
				selectionBox.y,
				selectionBox.width,
				selectionBox.height,
			);
		}
	}, [isDragging, startPoint, currentPoint, selectionBox]);

	const startTracing = () => {
		if (isTracing || !selectionBox) return;
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
					`circle ${i} cx: ${circle.cx.baseVal.value}, cy: ${circle.cy.baseVal.value}, r: ${circle.r.baseVal.value}`,
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
				getPointAtLength = (length: number) =>
					pathElement.getPointAtLength(length);
			} else if (element.tagName.toLowerCase() === "circle") {
				// approximate circle as a path with same circumference
				const circle = element as SVGCircleElement;
				pathLength = 2 * Math.PI * circle.r.baseVal.value;
				getPointAtLength = (length: number) => {
					const angle = (length / pathLength) * 2 * Math.PI;
					const x =
						circle.cx.baseVal.value + circle.r.baseVal.value * Math.cos(angle);
					const y =
						circle.cy.baseVal.value + circle.r.baseVal.value * Math.sin(angle);
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

				// get svg and canvas dimensions for proper scaling within the selection box
				const svgRect = svgElement.getBoundingClientRect();
				const scaleX = selectionBox.width / svgRect.width;
				const scaleY = selectionBox.height / svgRect.height;
				const scale = Math.min(scaleX, scaleY) * 0.5; // use 50% of available space

				const x =
					point.x * scale +
					selectionBox.x +
					selectionBox.width / 2 -
					12 * scale; // center based on viewBox
				const y =
					point.y * scale +
					selectionBox.y +
					selectionBox.height / 2 -
					12 * scale;

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
