import React, { useState } from 'react';
import * as d3 from 'd3';
import { useData } from '../../utils/useData';
import './styles.css';

const datasetUrl = 'uk-public-health.csv';

const dimensions = {
  width: 600,
  height: 800,
  margin: { top: 100, right: 60, bottom: 100, left: 60 },
};

export const RidgePlot = () => {
  const { width, height, margin } = dimensions;

  const boundedDimensions = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const [hoveredYear, setHoveredYear] = useState(-1);

  const data = useData(datasetUrl);

  if (!data) {
    return <div>Loading...</div>;
  }

  const years = data.columns.slice(1);

  const transformData = () => {
    let newData = {};
    let ages = [];
    years.forEach((year) => {
      newData[year] = [];
    });
    data.forEach((item) => {
      years.forEach((year) => {
        newData[year].push({ age: item['Age'], count: +item[year] });
      });
      ages.push(item['Age']);
    });
    return [newData, ages];
  };

  const [newData, ages] = transformData();

  // Define accessors
  const xAccessor = (d) => d.age;

  // Define Scales
  const xScale = d3
    .scaleBand()
    .domain(ages)
    .range([0, boundedDimensions.width]);

  const yScale = d3
    .scaleBand()
    .domain(years)
    .range([0, boundedDimensions.height]);

  const overlap = -3.5;

  const zScale = d3
    .scaleLinear()
    .domain([0, 150])
    .range([0, overlap * yScale.step()]);

  const areaGenerator = d3
    .area()
    .curve(d3.curveNatural)
    .x((d) => xScale(xAccessor(d)))
    .y0(0)
    .y1((d) => zScale(d.count));

  const handleMouseEnter = (year) => {
    setHoveredYear(year);
  };

  return (
    <div>
      <div>
        <h4>
          Middle-aged generation most likely to die by suicide and drug
          poisoning
        </h4>
      </div>
      <svg className="ridge-svg" width={width} height={height}>
        <defs>
          <linearGradient id="ridgeGradient" x1="0%" y1="0%" x2="0%" y2="110%">
            <stop offset="0%" stopColor="#dadada" />
            <stop offset="0%" stopColor="#0075A3" />
            <stop offset="100%" stopColor="#dadada" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {hoveredYear === -1 && (
            <g transform={`translate(0,${yScale(years[years.length - 1])})`}>
              <AxisBottom x2={xScale(ages[ages.length - 1])} xScale={xScale} />
              <text x={(boundedDimensions.width - margin.right) / 2} y={30}>
                Age
              </text>
            </g>
          )}

          <AxisRight
            yScale={yScale}
            width={boundedDimensions.width}
            hoveredYear={hoveredYear}
          />

          {years.map((year, i) => (
            <g key={i} transform={`translate(0,${yScale(year)})`}>
              <path
                d={areaGenerator(newData[year])}
                fill="url(#ridgeGradient)"
                opacity={
                  hoveredYear === -1 ? 1 : hoveredYear === +year ? 1 : 0.1
                }
                onMouseEnter={() => handleMouseEnter(+year)}
                onMouseLeave={() => setHoveredYear(-1)}
              />
              {hoveredYear === +year && (
                <g>
                  <AxisBottom
                    x2={xScale(ages[ages.length - 1])}
                    xScale={xScale}
                  />
                  {zScale.ticks(3).map((tick, i) => (
                    <g key={tick}>
                      <line
                        x1={0}
                        y1={zScale(tick)}
                        x2={xScale(ages[ages.length - 1])}
                        y2={zScale(tick)}
                        stroke="currentColor"
                        strokeOpacity=".2"
                        pointerEvents="none"
                      />
                      <text y={zScale(tick) - 5} opacity="0.5">
                        {tick}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

const AxisRight = ({ yScale, width, hoveredYear }) => {
  return (
    <g>
      {yScale.domain().map((year, i) => (
        <g
          key={i}
          className="ridge-y-axis"
          transform={`translate(${width + 10}, 0)`}
        >
          <text
            y={yScale(year)}
            opacity={hoveredYear === -1 ? 1 : hoveredYear === +year ? 1 : 0.1}
          >
            {year}
          </text>
        </g>
      ))}
    </g>
  );
};

const AxisBottom = ({ x2, xScale, transform }) => {
  return (
    <g className="x-axis" transform={transform}>
      <line x2={x2} stroke="#635f5d" />
      <g>
        <line
          x1={xScale('<10')}
          x2={xScale('<10')}
          y2={6}
          stroke="currentColor"
        />
        <text x={xScale('<10')} dy=".73" transform="translate(0,15)">
          {'<10'}
        </text>
      </g>
      {xScale
        .domain()
        .slice(2, xScale.domain().length)
        .map((age, i) => {
          return (
            (i + 1) % 10 === 0 && (
              <g key={i}>
                <line
                  x1={xScale(age)}
                  x2={xScale(age)}
                  y2={6}
                  stroke="currentColor"
                />
                <text x={xScale(age)} dy=".73" transform="translate(0,15)">
                  {age}
                </text>
              </g>
            )
          );
        })}
    </g>
  );
};
