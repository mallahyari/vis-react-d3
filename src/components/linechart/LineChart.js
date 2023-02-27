import React, { useState } from 'react';
import * as d3 from 'd3';
import AxisBottom from './AxisBottom';
import AxisLeft from './AxisLeft';
import { useData } from '../../utils/useData';

import './styles.css';

const datasetUrl =
  'https://gist.githubusercontent.com/mallahyari/8d4f6a43c80154bdb391edbc3f156029/raw/26792b80dbabdd6371bc9ff10c17f9a090495649/apple_stock_price.csv';

const dimensions = {
  width: 800,
  height: 400,
  margin: { top: 30, right: 30, bottom: 40, left: 60 },
};

export const LineChart = () => {
  const { width, height, margin } = dimensions;
  const boundedDimensions = {
    width: dimensions.width - margin.left - margin.right,
    height: dimensions.height - margin.top - margin.bottom,
  };

  const [tooltipData, setTooltipData] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  const data = useData(datasetUrl);
  if (!data) {
    return <div>Loading...</div>;
  }

  // Define accessors
  const dateParser = d3.timeParse('%Y-%m-%d');
  const xAccessor = (d) => dateParser(d.Date);
  const yAccessor = (d) => +d.Close;

  const xAxisLabel = 'Months';
  const yAxisLabel = 'Price';

  // Define Scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, boundedDimensions.width])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([boundedDimensions.height, 0])
    .nice();

  // Define line generator
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const handleMouseMove = (e) => {
    const mouseXYPos = d3.pointer(e);
    const xPos = mouseXYPos[0];
    const hoveredDate = xScale.invert(xPos);
    const bisectDate = d3.bisector((d) => xAccessor(d)).right;
    const closestIndex = bisectDate(data, hoveredDate);
    if (closestIndex >= data.length) return;
    const closestDataPoint = data[closestIndex];
    const closestXValue = xAccessor(closestDataPoint);
    const closestYValue = yAccessor(closestDataPoint);
    const newTooltipData = {
      data: closestDataPoint,
      x: xScale(closestXValue) + dimensions.margin.left,
      y: yScale(closestYValue),
    };
    setTooltipData(newTooltipData);
    setShowTooltip(true);
    setXPos(() => xScale(closestXValue));
    setYPos(() => yScale(closestYValue));
  };

  return (
    <div id="wrapper">
      <svg width={width} height={height} style={{ backgroundColor: '#F5F3F2' }}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <path
            d={lineGenerator(data)}
            className="line-chart"
            fill="none"
            stroke="#E3BA22"
            strokeWidth="2"
          />
          <AxisBottom
            width={boundedDimensions.width}
            height={boundedDimensions.height}
            xScale={xScale}
          />
          {/* X axis label */}
          <text
            x={boundedDimensions.width / 2}
            y={35}
            className="axis-label"
            transform={`translate(0, ${boundedDimensions.height})`}
            style={{
              fontSize: '11px',
              textAnchor: 'end',
            }}
          >
            {xAxisLabel}
          </text>
          <AxisLeft height={boundedDimensions.height} yScale={yScale} />

          {/* Y axis label */}
          <text
            textAnchor="middle"
            className="axis-label"
            transform={`translate(-35,${
              boundedDimensions.height / 2
            }) rotate(-90) `}
            style={{
              fontSize: '11px',
            }}
          >
            {yAxisLabel}
          </text>
          <rect
            width={boundedDimensions.width}
            height={boundedDimensions.height}
            fill="transparent"
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <>
              <circle
                cx={xPos}
                cy={yPos}
                r="3"
                fill="white"
                stroke="#BD2D28"
                strokeWidth="2"
                pointerEvents="none"
              />
              <line
                x1={xPos}
                y1={0}
                x2={xPos}
                y2={boundedDimensions.height}
                stroke="#0F8C79"
                strokeWidth="2"
                strokeDasharray="5,4"
                pointerEvents="none"
              />
            </>
          )}
        </g>
      </svg>
      {showTooltip && <Tooltip tooltipData={tooltipData} />}
    </div>
  );
};

const Tooltip = ({ tooltipData }) => {
  const { data } = tooltipData;
  return (
    <div
      className="tooltip"
      style={{
        transform: `translate(calc(-50% + ${tooltipData.x}px), calc(-100% + ${tooltipData.y}px))`,
      }}
    >
      <div className="tooltip-info">
        <p>
          <strong>Date: </strong>
          {data.Date}
        </p>
        <p>
          <strong>Price: </strong> {Number.parseFloat(data.Close).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
