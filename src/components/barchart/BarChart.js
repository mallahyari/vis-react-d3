import React, { useState } from 'react';
import * as d3 from 'd3';
import { useTooltip, Tooltip } from '@visx/tooltip';

import { useBarchartData } from '../../utils/useData';
import BarAxisLeft from './BarAxisLeft';
import BarAxisBottom from './BarAxisBottom';
import AnimatedBar from './AnimatedBar';
import './styles.css';

const dimensions = {
  width: 800,
  height: 400,
  margin: { top: 30, right: 30, bottom: 100, left: 60 },
};

export const BarChart = () => {
  const { width, height, margin } = dimensions;
  const boundedDimensions = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const {
    showTooltip,
    hideTooltip,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    tooltipData,
  } = useTooltip();

  const data = useBarchartData();

  if (!data) {
    return <div>Loading...</div>;
  }

  // Define accessors
  const xAccessor = (d) => +d.year;
  const yAccessor = (d) => +d.wheat;

  const barPadding = 0.2;
  const xDomain = data.map((d) => xAccessor(d));

  // Define Scales
  const xScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([0, boundedDimensions.width])
    .padding(barPadding);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([boundedDimensions.height, 0])
    .nice();

  const handleMouseOver = (e, d) => {
    const x = xScale(xAccessor(d));
    const y = yScale(yAccessor(d));
    showTooltip({
      tooltipLeft: x + xScale.bandwidth(),
      tooltipTop: y - margin.top - 50,
      tooltipData: d,
    });
  };

  return (
    <div id="wrapper">
      <svg className="bar-svg" width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((d, i) => (
            // <g key={i}>
            //   <rect
            //     x={xScale(xAccessor(d))}
            //     y={yScale(yAccessor(d))}
            //     width={xScale.bandwidth()}
            //     height={boundedDimensions.height - yScale(yAccessor(d))}
            //     fill="#E6842A"
            //     className="bar"
            //     onMouseOver={(e) => handleMouseOver(e, d)}
            //     onMouseOut={() => hideTooltip()}
            //   />
            // </g>
            <g key={i}>
              <AnimatedBar
                x={xScale(xAccessor(d))}
                y={yScale(yAccessor(d))}
                width={xScale.bandwidth()}
                height={boundedDimensions.height - yScale(yAccessor(d))}
                onMouseOver={(e) => handleMouseOver(e, d)}
                onMouseOut={() => hideTooltip()}
              />
            </g>
          ))}
          <BarAxisBottom
            width={boundedDimensions.width}
            height={boundedDimensions.height}
            xScale={xScale}
          />
          <BarAxisLeft
            width={boundedDimensions.width}
            height={boundedDimensions.height}
            yScale={yScale}
          />
          <text
            x={boundedDimensions.width / 2}
            y={height - margin.bottom + 20}
            textAnchor="middle"
            fontSize="12px"
          >
            Year
          </text>
          <text
            transform={`translate(-40,${
              boundedDimensions.height / 2
            }) rotate(-90) `}
            style={{
              fontSize: '11px',
            }}
          >
            Wheat
          </text>
        </g>
      </svg>
      {tooltipOpen && (
        <Tooltip left={tooltipLeft} top={tooltipTop} className="bar-tooltip">
          <div>
            <div>
              <p>
                <strong>Year: </strong>
                {tooltipData.year}
              </p>
              <p>
                <strong>Wheat: </strong>
                {tooltipData.wheat}
              </p>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};
