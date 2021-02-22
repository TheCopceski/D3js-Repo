const data = [
    { label: 'Abril', valueA: 100, valueB: 190 },
    { label: 'Maio', valueA: 90,  valueB: 50  },
    { label: 'Junho', valueA: 400, valueB: 300 },
    { label: 'Julho', valueA: 200, valueB: 100 },
    { label: 'Agosto', valueA: 350, valueB: 200 },
    { label: 'Setembro', valueA: 170, valueB: 80  }
];


const width = 537;
const height = 195;

//select and create svg
const svg = d3.select(".chart")
  .append("svg")
    .attr("width", 640)
    .attr("height", 420);
//chart selection
const chart = svg.append("g")
  .attr("width", '537px')
  .attr("height", '195px')
  .attr("transform", "translate(71, 112)");


// add title
svg.append('text')
  .attr('class', 'text-title')
  .attr('x', '32px') 
  .attr('y', '42px')
  .text('Gráfico com barras comparativas');
//add title line
svg.append('line')
  .attr('class', 'line-style')
  .attr('x1', '0px') 
  .attr('y1', '72px')
  .attr('x2', '640px') 
  .attr('y2', '72px');
//add bottom line
svg.append('line')
  .attr('class', 'line-style')
  .attr('x1', '71px') 
  .attr('y1', '355px')
  .attr('x2', width+71) 
  .attr('y2', '355px');


//data treatment
let keys = d3.map(data, d => d.label);
let subgroups = Object.keys(data[0]).slice(1);


//SCALES
//general X axis scale
const x = d3.scaleBand()
  .domain(keys)
  .range([0, width])
  .padding([0.2]);

//xAxis
const xAxisGenerator = d3.axisBottom(x).tickSize(0);
let xAxis = chart.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxisGenerator);
xAxis.selectAll(".tick text")
  .attr("dy", "29px");
xAxis.select(".domain").remove();

//general y axis scale
const y = d3.scaleLinear()
  .domain([0, 500])
  .range([ height, 0 ]);

//yAxis
const yAxisGenerator = d3.axisLeft(y)
  .ticks(5)
  .tickSize(-width);
let yAxis = chart.append("g").call(yAxisGenerator);
yAxis.selectAll(".tick text")
  .attr("dx", "-16px");
yAxis.select(".domain").remove();

//subgroups scale
const xSubgroup = d3.scaleBand()
  .domain(subgroups)
  .range([0, x.bandwidth()])
  .padding([0.45]);


//color scheme
const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#9C27B0','#2196F3']);

const rx= 5;
const ry= 5;
//CHART
//add bars
chart.append("g")
  .selectAll("g")
  .data(data).enter()
  .append("g")
    .attr("transform", d => "translate(" + x(d.label) + ",0)")
  .selectAll("path")
  .data(d => subgroups.map(key => ({key: key, value: d[key]})))
  .enter().append("path")
    .attr("d", item => `
      M${xSubgroup(item.key)},${y(item.value) + ry}
      a${rx},${ry} 0 0 1 ${rx},${-ry}
      h${'16' - 2 * rx}
      a${rx},${ry} 0 0 1 ${rx},${ry}
      v${height - y(item.value) - ry}
      h${-('16')}Z
    `)
    .attr("fill", d => color(d.key));
  
//Square Bars
// .enter().append("rect")
//   .attr("x", d => xSubgroup(d.key))
//   .attr("y", d => y(d.value))
//   .attr("width", "16px")
//   .attr("height", d => (height - y(d.value)) )
//   .attr("fill", d => color(d.key));


//GRAPH LEGEND
//add legend colors
svg.selectAll('circle')
  .data(subgroups)
  .enter().append('circle')
    .attr('class', 'circle-legend')
    .attr('cy', '375px') 
    .attr('cx',  d => {
      switch (d) {
        case 'valueA':
          return '75px';
        case 'valueB':
          return '170px';
        default:
      }
    })
    .attr('r', '4px')
    .style('fill', (d, i) => color(d));

//add legend labels
svg.selectAll('.legend-label')
  .data(subgroups)
  .enter().append('text')
    .attr('class', 'legend-label')
    .attr('y', '379px')
    .attr('x',  d => {
      switch (d) {
        case 'valueA':
          return '87px';
        case 'valueB':
          return '182px';
        default:
      }
    })
  .text(d => d );