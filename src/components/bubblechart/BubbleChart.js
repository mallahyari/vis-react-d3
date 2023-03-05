import React, { useState } from 'react';
import * as d3 from 'd3';
import { useTooltip, Tooltip } from '@visx/tooltip';

import { useData } from '../../utils/useData';
import './styles.css';
import { Box, Typography } from '@mui/material';

const datasetUrl =
  'https://raw.githubusercontent.com/htinkyawaye/tidytuesday-1/master/data/2019/2019-01-08/IMDb_Economist_tv_ratings.csv';

const dimensions = {
  width: 1000,
  height: 800,
  margin: { top: 100, right: 60, bottom: 100, left: 60 },
};

export const BubbleChart = () => {
  const { width, height, margin } = dimensions;
  const boundedDimensions = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const [isHovered, setIsHovered] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState();
  const [titleTrendData, setTitleTrendData] = useState();
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const data = useData(datasetUrl);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Define accessors
  const dateParser = d3.timeParse('%Y-%m-%d');
  const xAccessor = (d) => dateParser(d.date);
  const yAccessor = (d) => parseFloat(d.av_rating);
  const shareAccessor = (d) => parseFloat(d.share);

  // Define Scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, boundedDimensions.width])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([2, d3.max(data, yAccessor)])
    .range([boundedDimensions.height, 0])
    .nice();

  const radiusScale = d3
    .scaleSqrt()
    .domain(d3.extent(data, shareAccessor))
    .range([2, 15]);

  const colorScale = d3
    .scaleSequential()
    .domain([5, 10])
    .interpolator(d3.interpolateGnBu);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))
    .curve(d3.curveMonotoneX);

  const handleMouseEnter = (e, dataPoint) => {
    const titleTrend = data.filter((d) => d.titleId === dataPoint.titleId);
    const [x, y] = d3.pointer(e);
    setTitleTrendData(titleTrend);
    setHoveredPoint(dataPoint);
    showTooltip({
      tooltipLeft: x + margin.left,
      tooltipTop: y + margin.top,
      tooltipData: dataPoint,
    });
  };
  const handleMouseLeave = () => {
    hideTooltip();
    setHoveredPoint(null);
    setTitleTrendData(null);
  };

  return (
    <Box className="chart-wrapper">
      <div className="bubble-wrapper">
        <Typography variant="h5">Interactive Bubble chart</Typography>
        <Typography variant="body1" gutterBottom textAlign="left">
          TV dramas shown in America from 1990 - 2018
        </Typography>
        <svg className="bubble-svg" width={width} height={height}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <AxisBottom
              xScale={xScale}
              width={boundedDimensions.width}
              height={boundedDimensions.height}
              transform={`translate(0, ${boundedDimensions.height})`}
            />
            <text
              x={boundedDimensions.width / 2}
              y={boundedDimensions.height + 35}
              textAnchor="middle"
              fontSize="12px"
            >
              Year
            </text>
            <AxisRight
              yScale={yScale}
              transform={`translate(${boundedDimensions.width}, 0)`}
            />
            {data.map((d, i) => {
              const titleId = d.titleId;
              if (hoveredPoint) {
                if (hoveredPoint.titleId === titleId) {
                  return (
                    <circle
                      key={`${titleId}-${i}`}
                      className="bubble-focus"
                      cx={xScale(xAccessor(d))}
                      cy={yScale(yAccessor(d))}
                      r={radiusScale(shareAccessor(d))}
                      fill="#137B80"
                      stroke="#000"
                      strokeWidth="1"
                      strokeOpacity="0.2"
                      fillOpacity="1"
                      onMouseEnter={(e) => handleMouseEnter(e, d)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                }
                return (
                  <circle
                    key={`${titleId}-${i}`}
                    cx={xScale(xAccessor(d))}
                    cy={yScale(yAccessor(d))}
                    r={radiusScale(shareAccessor(d))}
                    fill={colorScale(yAccessor(d))}
                    strokeWidth="1"
                    strokeOpacity="0.05"
                    fillOpacity="0.1"
                    onMouseEnter={(e) => handleMouseEnter(e, d)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              }
              return (
                <circle
                  key={`${titleId}-${i}`}
                  cx={xScale(xAccessor(d))}
                  cy={yScale(yAccessor(d))}
                  r={radiusScale(shareAccessor(d))}
                  fill={colorScale(yAccessor(d))}
                  // fill="#4aaccc"
                  stroke="#000"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                  fillOpacity="0.3"
                  onMouseEnter={(e) => handleMouseEnter(e, d)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
            {titleTrendData && (
              <path
                d={lineGenerator(titleTrendData)}
                fill="none"
                stroke="#137B80"
                strokeWidth="2"
                pointerEvents="none"
              />
            )}
          </g>
        </svg>
        {tooltipOpen && (
          <Tooltip className="mytooltip" left={tooltipLeft} top={tooltipTop}>
            <div className="tooltip-info">
              <span style={{ textAlign: 'left' }}>
                <strong>{tooltipData.title}</strong>
              </span>
              <span style={{ textAlign: 'right', fontSize: '10px' }}>
                S{tooltipData.seasonNumber}
                {'  '}({d3.timeFormat('%Y')(dateParser(tooltipData.date))})
              </span>
            </div>
            <div className="tooltip-info">
              <p>Average rating</p>
              <p>{parseFloat(tooltipData.av_rating).toFixed(2)}</p>
            </div>
            <hr />
            <div className="tooltip-info">{tooltipData.genres}</div>
          </Tooltip>
        )}
      </div>
    </Box>
  );
};

const AxisRight = ({ yScale, transform }) => {
  return (
    <g transform={transform}>
      {yScale
        .ticks(3)
        .slice(1)
        .map((tick, i) => (
          <g key={i} className="y-axis">
            <line
              x2={-10}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="currentColor"
            />
            <text y={yScale(tick)} dx=".72em" dy={'.32em'} textAnchor="middle">
              {tick}
            </text>
          </g>
        ))}
    </g>
  );
};

const AxisBottom = ({ xScale, width, height, transform }) => {
  return (
    <g className="x-axis" transform={transform}>
      <line x2={width} stroke="currentColor" />

      {xScale.ticks(5).map((tick, i) => {
        return (
          <g key={i}>
            <line
              x1={xScale(tick)}
              x2={xScale(tick)}
              y2={-height}
              stroke="currentColor"
              strokeOpacity="0.2"
            />
            <line
              x1={xScale(tick)}
              x2={xScale(tick)}
              y2={6}
              stroke="currentColor"
            />
            <text x={xScale(tick)} dy=".73" transform="translate(0,15)">
              {d3.timeFormat('%Y')(tick)}
            </text>
          </g>
        );
      })}
    </g>
  );
};
