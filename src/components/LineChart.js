import React from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';
import AxisBottom from './AxisBottom';
import AxisLeft from './AxisLeft';

const dimensions = {
  width: 800,
  height: 400,
  margin: { top: 30, right: 30, bottom: 40, left: 60 },
};

const LineChart = ({ data }) => {
  const { width, height, margin } = dimensions;
  const boundedDimensions = {
    width: dimensions.width - margin.left - margin.right,
    height: dimensions.height - margin.top - margin.bottom,
  };

  console.log(data[0]);

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
  console.log(yScale.domain());

  // Define line generator
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  return (
    <Box id="wrapper">
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
        </g>
      </svg>
    </Box>
  );
};

export default LineChart;
