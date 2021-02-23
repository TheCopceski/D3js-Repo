const data = [
    { date: '10-10-2021', valueA: 100,  valueB: 0 },
    { date: '11-10-2021', valueA: 190,  valueB: 0  },
    { date: '12-10-2021', valueA: 50,  valueB: 130 },
    { date: '13-10-2021', valueA: 210, valueB: 130 },
    { date: '14-10-2021', valueA: 350, valueB: 50 },
    { date: '15-10-2021', valueA: 350, valueB: 100 }
];

const oldValueA = 500;//previous period valueA
const oldValueB = 345;//previous period valueB

const width = 537;
const height = 195;

let totalA = 0;
let totalB = 0;
for(let i = 1; i < data.length; i++){
  totalA += Math.abs(data[i].valueA - data[i-1].valueA);
  totalB += Math.abs(data[i].valueB - data[i-1].valueB);
}

const bisectDate = d3.bisector(d => d.date).left;

const createGradientA = select => {
  const gradient = select
    .select('defs')
      .append('linearGradient')
        .attr('id', 'gradient-valueA')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%');

  gradient
    .append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color:#2196F3;stop-opacity:0.01');

  gradient
    .append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color:#2196F3;stop-opacity:0.08');
}

const createGradientB = select => {
  const gradient = select
    .select('defs')
      .append('linearGradient')
        .attr('id', 'gradient-valueB')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%');

  gradient
    .append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color:#9C27B0;stop-opacity:0.01');

  gradient
    .append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color:#9C27B0;stop-opacity:0.08');
}

//select and create svg
const svg = d3.select(".chart")
  .append("svg")
    .attr("width", 640)
    .attr("height", 483);

svg.append('defs');
svg.call(createGradientA);
svg.call(createGradientB);

//chart selection
const chart = svg.append("g")
  .attr("width", '537px')
  .attr("height", '195px')
  .attr("transform", "translate(71, 224)");

// add title
svg.append('text')
  .attr('class', 'text-style')
  .attr('x', '32px') 
  .attr('y', '42px')
  .style("font-family", "Inter")
  .style("font-size", "22px")
  .style('font-weight', '600')
  .style('line-height', '32px')
  .style("fill", "#262C2C")
  .text('Solicitações');
svg.append('text')
  .attr('class', 'text-title')
  .attr('x', '506px') 
  .attr('y', '44px')
  .style("font-family", "Inter")
  .style("font-size", "12px")
  .style("fill", "#9CABAB")
  .text('VER TUDO');
svg.append('text')
  .attr('class', 'text-title')
  .attr('x', '580px') 
  .attr('y', '44px')
  .style("font-family", "Inter")
  .style("font-size", "16px")
  .style("fill", "#9CABAB")
  .text('>');

//add title line
svg.append('line')
  .attr('class', 'line-style')
  .attr('x1', '0px') 
  .attr('y1', '72px')
  .attr('x2', '640px') 
  .attr('y2', '72px');

//add total value
svg.append('text')
  .attr('class', 'text-style')
  .attr('id', 'total-number')
  .attr('x', '32px') 
  .attr('y', '136px')
  .text(totalA);
//add comparative value
svg.append('text')
  .attr('class', 'text-style')
  .attr('id', 'relation-number')
  .attr('x', '56px') 
  .attr('y', '164px')
  .style('fill', () => totalA - oldValueA > 0 ? "#4CAF50" : "#AF4C4C")
  .style('font-weight', '700')
  .style('font-size', '12px')
  .style('line-height', '16px')
  .text(() => totalA - oldValueA > 0 ? `+${totalA - oldValueA}` : `${totalA - oldValueA}`)
svg.append('text')
  .attr('class', 'text-style')
  .attr('x', '91px') 
  .attr('y', '164px')
  .style("font-family", "Inter")
  .style("font-size", "12px")
  .style("fill", "#9CABAB")
  .text("em relação ao periodo anterior");
  
//total number line
svg.append('line')
  .attr('class', 'line-style')
  .attr('x1', '32px') 
  .attr('y1', '184px')
  .attr('x2', '608px') 
  .attr('y2', '184px');


//data treatment
let lineData = d3.map(data, d => (
  {
    date: d3.timeParse("%d-%m-%Y")(d.date),
    valueA: d.valueA,
    valueB: d.valueB,
  }
));


//SCALES
//color scale
var color = d3.scaleOrdinal()
  .domain(Object.keys(lineData[0]).filter(key => key !== "date"))
  .range(["#2196F3", "#9C27B0"])

//general X axis scale
var xScale = d3.scaleTime()
  .domain(d3.extent(lineData, d => d.date))
  .range([ 0, width ]);


//xAxis
const xAxisGenerator = d3.axisBottom(xScale)
  .tickSize(0)
  .ticks(data.length)
  .tickFormat(d3.timeFormat("%d %b"));
let xAxis = chart.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxisGenerator);
xAxis.selectAll(".tick text")
  .attr("dy", "29px");
xAxis.select(".domain").remove();

//general y axis scale
const yScale = d3.scaleLinear()
  .domain([0, 500])
  .range([ height, 0 ]);

//yAxis
const yAxisGenerator = d3.axisLeft(yScale)
  .ticks(5)
  .tickSize(-width);
let yAxis = chart.append("g").call(yAxisGenerator);
yAxis.selectAll(".tick text")
  .attr("dx", "-16px");
yAxis.select(".domain").remove();
    
  
//CHART 
var lineGenerator = d3.line()
  .curve(d3.curveMonotoneX) // line smoothing
  .x(d => xScale(d.date)) 
  .y(d => yScale(d.value)) 

//data treatment
const lines = color.domain().map(key => (
  {
    name: key,
    values: data.map(d => ({
      date: d3.timeParse("%d-%m-%Y")(d.date),
      value: +d[key]
    })),
    total: key === "valueA" ? totalA : totalB,
    difference: key === "valueA" ? totalA - oldValueA : totalB - oldValueB
  }
))

const chartLines = chart.selectAll(".line-chart")
  .data(lines)
  .enter().append("g")
  .attr("class", ".line-chart");
//mouse over effects
var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects")
  .attr("transform", "translate(71, 224)")
  .style("display", "none");
//mouse line
mouseG.append("path") 
  .attr("class", "line-style")
  .attr("id", "mouse-line");

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(lines)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");
//line dots
mousePerLine.append("circle")
  .attr("r", 6)
  .style("stroke", d => color(d.name))
  .style("fill", "#FFFFFF")
  .style("stroke-width", "1.4px")

mousePerLine.append("circle")
  .attr("r", 2)
  .style("fill", d => color(d.name));

//tooltips
const tooltipG = mouseG.append("g")
  .attr("class", "tooltip");

tooltipG.append("rect")
  .attr("class", "tooltip")
  .attr("width", 70)
  .attr("height", 56)
  .attr("x", -35)
  .attr("y", -75)
  .attr("rx", 4)
  .attr("ry", 4);
//tooltip valueA
tooltipG.append("text")
  .attr("class", "tooltip-value")
  .attr("id", "tooltip-valueA")
  .attr("x", -5)
  .attr("y", -53);
//tooltip valueB
tooltipG.append("text")
  .attr("class", "tooltip-value")
  .attr("id", "tooltip-valueB")
  .attr("x", -5)
  .attr("y", -32);
//legend circle
tooltipG.append("circle")
  .attr("class", "tooltip-circleA")
  .attr("r", 3)
  .attr("cx", -15)
  .attr("cy", -56)
  .style("fill", "#2196F3");
//legend circle
tooltipG.append("circle")
  .attr("class", "tooltip-circleB")
  .attr("r", 3)
  .attr("cx", -15)
  .attr("cy", -37)
  .style("fill", "#9C27B0");

//plotted graph lines
chartLines.append("path")
  .attr("class", "plotted-chart-line")
  .attr("id", d => `${d.name}-line`)
  .attr("d", d => lineGenerator(d.values))
  .style("stroke", d => color(d.name))
  .style("fill", "none")
  .style("stroke-width", "1.4px");

//gradient lines
chartLines.append("path")
  .attr("class", 'gradient-line')
  .attr("id", d => `${d.name}-closed`)
  .attr("d", d => {
    const lineValues = lineGenerator(d.values).slice(1);
    const splitedValues = lineValues.split(',');
    return `M0,${height},${lineValues},l0,${height - splitedValues[splitedValues.length - 1]}`
  })
  .style("stroke", d => color(d.name))
  .style("fill", 'none')
  .style("stroke-width", "0px");

//transparent line (mouse event)
chartLines.append("path")
  .attr("class", "chart-line")
  .attr("id", d => `${d.name}-line`)
  .attr("d", d => lineGenerator(d.values))
  .style("stroke", d => color(d.name))
  .style("fill", "none")
  .attr("opacity", 0)
  .style("stroke-width", "30px")
  .on("mouseover", (click,d) => lineHover(click,d))
  .on("mousemove", (click,d) => lineHover(click,d))
  .on("mouseout", () => mouseG.style("display", "none"))
  .on("click", (click,d) => lineClick(click,d));

d3.select("#valueA-closed").style("fill", "url(#gradient-valueA)");
d3.select("#valueA-line").style("stroke-width", "1.8px");

//mouse hover effects
function lineHover(clickEvent, hoverData){
  mouseG.style("display", null);
  var mouse = d3.pointer(event,this);
  var xDate = xScale.invert(mouse[0]-135);
  let i = bisectDate(hoverData.values, xDate),
  d0 = hoverData.values[i - 1],
  d1 = hoverData.values[i],

  xPos = xDate - d0.date > d1.date - xDate ? d1 : d0;
  let draw = "M" + xScale(xPos.date) + "," + 0;
  draw += " " + xScale(xPos.date) + "," + 195;

  tooltipG.attr("transform", "translate(" + xScale(xPos.date) + "," + yScale(xPos.value) + ")");
  d3.select("#mouse-line").attr("d", draw)

  d3.selectAll(".mouse-per-line")
    .attr("transform", d => {
      d0 = d.values[i - 1];
      d1 = d.values[i];
      xPos = xDate - d0.date > d1.date - xDate ? d1 : d0;
      switch (d.name){
        case "valueA":
          tooltipG.select("#tooltip-valueA").text(xPos.value)
        case "valueB":
          tooltipG.select("#tooltip-valueB").text(xPos.value)
        default:
      }
      return "translate(" + xScale(xPos.date) + "," + yScale(xPos.value) + ")"
    });
}

//mouse click effects
function lineClick (clickEvent, hoverData) {
  d3.selectAll('.gradient-line').style("fill", 'none')
  d3.selectAll('.plotted-chart-line').style("stroke-width", "1.4px");
  d3.select(`#${hoverData.name}-closed`).style("fill", `url(#gradient-${hoverData.name})`);
  d3.select(`#${hoverData.name}-line`).style("stroke-width", "1.8px");
  d3.select('#total-number').text(hoverData.total);
  d3.select('#relation-number')
    .style('fill', () => hoverData.difference > 0 ? "#4CAF50" : "#AF4C4C")
    .text(() => hoverData.difference > 0 ? `+${hoverData.difference}` : `${hoverData.difference}`);
}