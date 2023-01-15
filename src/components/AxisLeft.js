import React from 'react';

const AxisLeft = ({ height, yScale }) => {
  return (
    <g className="axis yaxis">
      <line x1={0} y2={height} stroke="currentColor" />

      {yScale.ticks().map((tickvalue, i) => (
        <g key={i} transform={`translate(0,${yScale(tickvalue)})`}>
          <line x2={-6} stroke="currentColor" />
          <text
            // x={-15}
            dy={'.32em'}
            fill="currentColor"
            style={{
              fontSize: '10px',
              textAnchor: 'end',
              transform: 'translateX(-15px)',
            }}
          >
            {tickvalue}
          </text>
        </g>
      ))}
    </g>
  );
};

export default AxisLeft;
