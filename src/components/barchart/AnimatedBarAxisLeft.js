import React from 'react';
import { useTrail, animated } from '@react-spring/web';

const AnimatedBarAxisLeft = ({ height, yScale }) => {
  const ticks = yScale.ticks();
  const trail = useTrail(ticks.length, {
    config: {
      duration: 200,
    },
    from: {
      opacity: 0,
      transform: 'translateX(-20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(-10px)',
    },
  });

  return (
    <g className="axis yaxis">
      <line x1={0} y2={height} stroke="currentColor" />

      {trail.map((props, i) => (
        <g key={i} transform={`translate(0,${yScale(ticks[i])})`}>
          <line x2={-6} stroke="currentColor" />
          <animated.text
            dy={'.32em'}
            fill="currentColor"
            style={{
              fontSize: '10px',
              textAnchor: 'end',
              ...props,
            }}
          >
            {ticks[i]}
          </animated.text>
        </g>
      ))}
    </g>
  );
};

export default AnimatedBarAxisLeft;
