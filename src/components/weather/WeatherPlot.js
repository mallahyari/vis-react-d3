import React from 'react';
import * as d3 from 'd3';
import './styles.css';
import { useWeatherData } from '../../utils/useData';

const dimensions = {
  width: 1100,
  height: 1100,
  margin: { top: 50, right: 60, bottom: 50, left: 60 },
};

export const WeatherPlot = () => {
  const { width, height, margin } = dimensions;
  const boundedDimensions = {
    width: dimensions.width - margin.left - margin.right,
    height: dimensions.height - margin.top - margin.bottom,
  };
  const boundedRadius = boundedDimensions.width / 2;
  const outerRadius = (boundedDimensions.width / 2) * 0.5;
  const innerRadius = outerRadius / 3;
  const numOfStops = 10;

  // Load the data
  const data = useWeatherData();

  if (!data) {
    return <div>Loading...</div>;
  }

  // Define accessors functions
  const tempMinAccessor = (d) => +d.tempMin;
  const tempMaxAccessor = (d) => +d.tempMax;
  const windAccessor = (d) => +d.wind;
  const dateParser = d3.timeParse('%Y-%m-%d');
  const dateAccessor = (d) => dateParser(d.date);

  // Group by the data based on `weather` types
  const dataGroupedByWeather = d3.group(data, (d) => d.weather);

  // Create offsets to easily draw circles with certain offset of the main radius.
  const weatherTypes = Array.from(dataGroupedByWeather.keys());
  const weatherTypeOffsets = weatherTypes.map((t, i) => ({
    type: t,
    offset: 1.18 + i * 0.1,
  }));

  const windOffset = 1.7;

  // Define colors for color coding different types of weather
  const weatherColors = d3.schemeRdYlGn[5];

  // Create gradient color for area path
  const gradientColorScale = d3.interpolateBrBG;

  // Create angle scale for mapping the dates to angles
  const angleScale = d3
    .scaleTime()
    .domain(d3.extent(data, dateAccessor))
    .range([0, 2 * Math.PI]);

  // Create radius scale for mapping min and max temperatures to distances
  const radiusScale = d3
    .scaleLinear()
    .domain(
      d3.extent([...data.map(tempMinAccessor), ...data.map(tempMaxAccessor)])
    )
    .range([innerRadius, outerRadius])
    .nice();

  // Create radius scale for wind numbers
  const windRadiusScale = d3
    .scaleSqrt()
    .domain(d3.extent(data, windAccessor))
    .range([2, 10]);

  // Define month names for creating text labels on the plot
  const months = d3.timeMonths(...angleScale.domain());
  const monthsTextPath = months.map((d) => [d, d3.utcMonth.offset(d, 1)]);

  // Define a function to convert angle into position
  const getCoordinatesForAngle = (angle, radius, offset = 1) => {
    return d3.pointRadial(angle, radius * offset);
  };

  // Define ticks for our plot
  const tempTicks = radiusScale.ticks(5);

  // Define generators for shape of the plot
  const areaGenerator = d3
    .areaRadial()
    .angle((d) => angleScale(dateAccessor(d)))
    .innerRadius((d) => radiusScale(tempMinAccessor(d)))
    .outerRadius((d) => radiusScale(tempMaxAccessor(d)));

  // METHOD 1
  const lineGenerator = areaGenerator.lineOuterRadius();

  // METHOD 2
  // const lineGenerator = d3
  //   .lineRadial()
  //   .curve(d3.curveCardinal)
  //   .angle((d) => angleScale(dateAccessor(d)))
  //   .radius((d) => radiusScale(tempMaxAccessor(d)));

  // Define a function for creating text annotations on the plot
  const drawAnnotation = (angle, offset, text) => {
    const [x1, y1] = getCoordinatesForAngle(angle, outerRadius, offset);
    const [x2, y2] = getCoordinatesForAngle(angle, outerRadius, 2);

    return { x1, x2, y1, y2, text };
  };

  // Define annotation for various type of information
  const sunAnnotation = drawAnnotation(
    Math.PI * 0.21,
    weatherTypeOffsets.find((el) => el.type === 'sun')['offset'],
    'Sunny days'
  );
  const rainAnnotation = drawAnnotation(
    Math.PI * 0.3,
    weatherTypeOffsets.find((el) => el.type === 'rain')['offset'],
    'Rainy days'
  );
  const snowAnnotation = drawAnnotation(
    Math.PI * 0.05,
    weatherTypeOffsets.find((el) => el.type === 'snow')['offset'],
    'Snowy days'
  );
  const drizzleAnnotation = drawAnnotation(
    Math.PI * 0.25,
    weatherTypeOffsets.find((el) => el.type === 'drizzle')['offset'],
    'Drizzly days'
  );
  const fogAnnotation = drawAnnotation(
    Math.PI * 0.367,
    weatherTypeOffsets.find((el) => el.type === 'fog')['offset'],
    'foggy days'
  );
  const windAnnotation = drawAnnotation(Math.PI * 0.15, windOffset, 'Wind');

  return (
    <div>
      <svg width={width} height={height} style={{ backgroundColor: '#000' }}>
        <defs>
          <radialGradient id="temp-gradient">
            {d3.range(numOfStops).map((i) => (
              <stop
                key={i}
                offset={`${(i / (numOfStops - 1)) * 100}%`}
                stopColor={gradientColorScale(i / (numOfStops - 1))}
              />
            ))}
          </radialGradient>
        </defs>
        <g
          transform={`translate(${margin.left + boundedRadius} ,${
            margin.top + boundedRadius
          } )`}
        >
          {monthsTextPath.map(([a, b], i) => {
            const id = `month-path-${i}`;
            const angleA = angleScale(a);
            const angleB = angleScale(b);
            const movePoint = getCoordinatesForAngle(angleA, outerRadius);
            const arcPoint = getCoordinatesForAngle(angleB, outerRadius);

            return (
              <g key={`g-${i}`}>
                <path
                  key={id}
                  id={id}
                  d={`
                      M${movePoint} 
                      A${outerRadius},${outerRadius} 0,0,1 ${arcPoint}`}
                />
                <text
                  key={`month-textPath-${i}`}
                  textAnchor="middle"
                  className="tick-label"
                >
                  <textPath startOffset="50%" href={`#${id}`}>
                    {d3.utcFormat('%B')(a)}
                  </textPath>
                </text>
              </g>
            );
          })}

          {months.map((m, i) => {
            const angle = angleScale(m);
            const angleOffset = Math.PI / 12;
            const [x1, y1] = getCoordinatesForAngle(angle, innerRadius);
            const [x2, y2] = getCoordinatesForAngle(angle, outerRadius, 1.01);
            const [labelX, labelY] = getCoordinatesForAngle(
              angle + angleOffset,
              outerRadius,
              1.05
            );
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={2}
                  className="grid-line"
                />
                {/* <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="tick-label"
                >
                  {d3.timeFormat('%B')(m)}
                </text> */}
              </g>
            );
          })}

          {tempTicks.map((t, i) => (
            <g key={i}>
              <circle r={radiusScale(t)} className="grid-line" />
              <rect
                x={5}
                y={-radiusScale(t) - 10}
                width={30}
                height={20}
                fill="#000"
              />
              <text
                x={6}
                y={-radiusScale(t) + 5}
                className="tick-label-temperature"
              >
                {`${d3.format('.0f')(t)}\u00b0F`}
              </text>
            </g>
          ))}
          <path
            d={areaGenerator(data)}
            fill={`url(#temp-gradient)`}
            className="area"
          />
          <path
            d={lineGenerator(data)}
            fill="none"
            stroke="#f8f9fa"
            className="line-radial"
          />
          {/* <path
            d={lineGeneratorMin(data)}
            fill="none"
            stroke="#f8f9fa"
            className="line-radial"
          /> */}

          {weatherTypes.map((wt, i) =>
            dataGroupedByWeather.get(wt).map((d, j) => {
              const angle = angleScale(dateAccessor(d));
              const [x, y] = getCoordinatesForAngle(
                angle,
                outerRadius,
                weatherTypeOffsets[i].offset
              );

              return (
                <g key={`${wt}-${i}${j}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={5}
                    fill={weatherColors[i]}
                    className={`${wt}-circle`}
                  />
                </g>
              );
            })
          )}

          {data.map((d, i) => {
            const angle = angleScale(dateAccessor(d));
            const [x, y] = getCoordinatesForAngle(
              angle,
              outerRadius,
              windOffset
            );

            return (
              <g key={`wind-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={windRadiusScale(windAccessor(d))}
                  className={`wind-circle`}
                />
              </g>
            );
          })}
          <Annotaion annotationData={sunAnnotation} />
          <Annotaion annotationData={rainAnnotation} />
          <Annotaion annotationData={snowAnnotation} />
          <Annotaion annotationData={drizzleAnnotation} />
          <Annotaion annotationData={fogAnnotation} />
          <Annotaion annotationData={windAnnotation} />
        </g>
        {/* End of bounded g */}
      </svg>
    </div>
  );
};

const Annotaion = ({ annotationData }) => (
  <g>
    <line
      x1={annotationData.x1}
      x2={annotationData.x2}
      y1={annotationData.y1}
      y2={annotationData.y2 + 10}
      className="annotation-line"
    />
    <text
      x={annotationData.x2 + 5}
      y={annotationData.y2 + 10}
      className="annotation-text"
    >
      {annotationData.text}
    </text>
  </g>
);
