const data = [
    { label: 'Caixa de entrada', value: 40 },
    { label: 'Em progresso', value: 50 },
    { label: 'Finalizadas', value: 30 }
]

//data treatment
function groupData (data, total) {
  //percent values
  const percent = d3.scaleLinear()
    .domain([0, total])
    .range([0, 100])
  
  let cumulative = 0
  const _data = data.map(d => {
    cumulative += d.value
    return {
      value: d.value,
      cumulative: cumulative - d.value,
      label: d.label,
      percent: percent(d.value)
    }
  }).filter(d => d.value > 0)
  return _data
};


const w = 400;
const h = 345; 
const colors = ['#EEF1F1', '#9C27B0', '#2196F3'];

const total = d3.sum(data, d => d.value)
const _data = groupData(data, total)

console.log(_data);

//select and create svg
const svg = d3.select('.progress')
  .append('svg')
    .attr('width', '400px')
    .attr('height', '482px');

//add title
svg.append('text')
  .attr('class', 'text-title')
  .attr('x', '32px') 
  .attr('y', '42px')
  .text('Progresso');

//add lines
svg.append('line')
  .attr('class', 'line-style')
  .attr('x1', '0px') 
  .attr('y1', '72px')
  .attr('x2', '400') 
  .attr('y2', '72px');

svg.append('line')
  .attr('class', 'line-style')
  .attr('x1', '146px') 
  .attr('y1', '184px')
  .attr('x2', '386px') 
  .attr('y2', '184px');

svg.append('line')
  .attr('class', 'line-style')
  .attr('x1', '146px') 
  .attr('y1', '288px')
  .attr('x2', '386px') 
  .attr('y2', '288px');

//graph scale
const yScale = d3.scaleLinear()
  .domain([0, total])
  .range([0, h])

//CHART
//add bars
svg.append('g')
  .selectAll('rect')
  .data(_data)
  .enter().append('rect')
    .attr('x', '32px') 
    .attr('y', d => yScale(d.cumulative) + 104 )
    .attr('height', d => yScale(d.value) + 4 )
    .attr('width', '80px')
    .style('fill', (d, i) => colors[i]);

//add rounded corners
svg.append('path')
  .attr("d", item => `
    M37,457
    a5,5 0 0 1 -5,-5
    h80
    a5,5 0 0 1 -5,5
  `)
  .attr("fill", "#2196F3");

svg.append('path')
  .attr("d", item => `
    M32,105
    a5,5 0 0 1 5,-5
    h${80 - 2*5}
    a5,5 0 0 1 5,5
  `)
  .attr("fill", "#EEF1F1");
  

//DATA DISPLAY & GRAPH LEGEND
//add bar percentages
svg.selectAll('.text-percent')
  .data(_data)
  .enter().append('text')
    .attr('class', 'text-percent')
    .attr('x', '144px')
    .attr('y',  d => {
      switch (d.label) {
        case 'Caixa de entrada':
          return '136px';
        case 'Em progresso':
          return '240px';
        case 'Finalizadas':
          return '344px';
      }
    })
  .text(d => d3.format('d')(d.percent) + '%');

//add legend colors
svg.selectAll('circle')
  .data(_data)
  .enter().append('circle')
    .attr('class', 'circle-legend')
    .attr('cx', '150px') 
    .attr('cy',  d => {
      switch (d.label) {
        case 'Caixa de entrada':
          return '156px';
        case 'Em progresso':
          return '260px';
        case 'Finalizadas':
          return '364px';
      }
    })
    .attr('r', '4px')
    .style('fill', (d, i) => colors[i]);

//add legend labels
svg.selectAll('.legend-label')
  .data(_data)
  .enter().append('text')
    .attr('class', 'legend-label')
    .attr('x', '162px')
    .attr('y',  d => {
      switch (d.label) {
        case 'Caixa de entrada':
          return '160px';
        case 'Em progresso':
          return '264px';
        case 'Finalizadas':
          return '368px';
      }
    })
  .text(d => d.label );