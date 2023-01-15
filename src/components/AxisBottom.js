import React from 'react';
import { timeFormat } from 'd3';

const AxisBottom = ({ width, height, xScale }) => {
  return (
    <g className="axis xaxis" transform={`translate(0, ${height})`}>
      <line x1={0} x2={width} stroke="currentColor" />

      {xScale.ticks().map((tickvalue, i) => (
        <g key={i} transform={`translate(${xScale(tickvalue)},0)`}>
          <line y2={6} stroke="currentColor" />
          <text
            // y="15"
            dy=".71em"
            fill="currentColor"
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(15px)',
            }}
          >
            {timeFormat('%b %Y')(tickvalue)}
          </text>
        </g>
      ))}
    </g>
  );
};

export default AxisBottom;
