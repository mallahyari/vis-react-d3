import React from 'react';

const BarAxisLeft = ({ width, height, yScale }) => {
  return (
    <g className="axis yaxis">
      <line x1={0} y2={height} stroke="currentColor" />

      {yScale.ticks().map((tickvalue, i) => (
        <g key={i} transform={`translate(0,${yScale(tickvalue)})`}>
          {/*  horizontal grid lines */}
          <line x2={width} stroke="currentColor" strokeOpacity="0.2" />
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

export default BarAxisLeft;
