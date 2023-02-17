import React from 'react';
import { useSpring, animated, easings } from '@react-spring/web';

const AnimatedBar = ({ x, y, width, height, onMouseOver, onMouseOut }) => {
  const springStyle = useSpring({
    config: {
      duration: 5000,
      easing: easings.easeOutCubic,
    },
    from: {
      height: 0,
      // y: height,
    },
    to: {
      height: height,
      // y: y,
    },
  });

  return (
    <g>
      <animated.rect
        x={x}
        y={y}
        width={width}
        fill="#E6842A"
        className="bar"
        style={{
          transform: springStyle.height.to(
            (h) => `translateY(${height - h}px)`
          ), // Adjust position based on height
          height: springStyle.height,
        }}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      />
      {/* <animated.text
        x={x + width / 2}
        y={springStyle.y.to((y) => y - 5)}
        fill="#333"
        textAnchor="middle"
        style={{ fontSize: '12px' }}
      >
        10
      </animated.text> */}
    </g>
  );
};

export default AnimatedBar;
