let data;
let showPercentage = false;
let medData = 0;
let monData = 0;

const showPercentageButton = document.getElementById('percentageButton');
showPercentageButton.addEventListener('click', function () {
  showPercentage = true;
  updateGraphs();
});

const showCasesButton = document.getElementById('totalButton');
showCasesButton.addEventListener('click', function () {
  showPercentage = false;
  updateGraphs();
});

const physicianButton = document.getElementById('physicianButton');
physicianButton.addEventListener('click', function () {
  medData = 0;
  updateGraphs();
});

const hospitalButton = document.getElementById('hospitalButton');
hospitalButton.addEventListener('click', function () {
  medData = 1;
  updateGraphs();
});

const fundingButton = document.getElementById('fundingButton');
fundingButton.addEventListener('click', function () {
  medData = 2;
  updateGraphs();
});

const unemploymentButton = document.getElementById('unemploymentButton');
unemploymentButton.addEventListener('click', function () {
  monData = 0;
  updateGraphs();
});

const gdpButton = document.getElementById('gdpButton');
gdpButton.addEventListener('click', function () {
  monData = 1;
  updateGraphs();
});


d3.csv('COVID19_state.csv').then(csvData => {
  csvData.forEach(d => {
    d.cases = +d.cases;
  });
  data = csvData;
  updateGraphs();
});

const chartWidth = 800;
const chartHeight = 800;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const width = chartWidth - margin.left - margin.right;
const height = chartHeight - margin.top - margin.bottom;

function createBarGraph1() {
  d3.select('#scene1 svg').remove();
  const states = data.map(d => d.State);
  let cases;
  if (showPercentage) {
    cases = data.map(d => (d.Infected / d.Population) * 100);
  } else {
    cases = data.map(d => d.Infected);
  }
  
    const stateCases = states.map((state, index) => ({ state, cases: cases[index] }));
  
    stateCases.sort((a, b) => a.state.localeCompare(b.state));
    
    const svg = d3.select('#scene1')
      .append('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select('#scene1')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  
    const xScale = d3.scaleBand()
      .domain(stateCases.map(d => d.state))
      .range([0, width])
      .padding(0.1);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(cases)])
      .range([height, 0]);
  
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .call(d3.axisLeft(yScale));
  
    svg.selectAll('.bar')
      .data(stateCases)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.state))
      .attr('y', d => yScale(d.cases))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.cases))
      .attr('fill', 'rgb(143, 51, 51)')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('fill', 'orange');
          
        tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      
        tooltip.html(`${d.state}<br>${d.cases}`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .attr('fill', 'rgb(143, 51, 51)') 
          tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.top - 10)
    .style('text-anchor', 'middle')
    .text('State')
  if (showPercentage) {
    svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', -margin.left + 40)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Percentage');
  
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Percentage of Population Infected by COVID-19: 2020');

      svg.append('rect')
      .attr('x', width - 550) 
      .attr('y', yScale(5))
      .attr('width', 250)
      .attr('height', 25)
      .attr('fill', 'white') 
      .attr('stroke', 'red'); 
  
      svg.append('text')
      .attr('x', width - 310) 
      .attr('y', yScale(4.825)) 
      .attr('text-anchor', 'end') 
      .text('Data is somewhat normalized for all states')
      .attr('stroke', 'rgb(0, 0, 0)')
      .attr('stroke-width', 1)
      .style('font-size', '12px')
      .attr('font-style', 'italic');
    }
  else
  {
    svg.append('text')
    .attr('x', -(height / 2))
    .attr('y', -margin.left + 40)
    .attr('transform', 'rotate(-90)')
    .style('text-anchor', 'middle')
    .text('Number of Cases');

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .style('text-anchor', 'middle')
    .style('font-size', '18px')
    .text('COVID-19 Cases per State: 2020');
  
  svg.append('line')
    .attr('x1', 0) 
    .attr('x2', width)
    .attr('y1', yScale(14000)) 
    .attr('y2', yScale(14000)) 
    .attr('stroke', 'orange') 
    .attr('stroke-width', 2); 

    svg.append('rect')
    .attr('x', width - 445) 
    .attr('y', yScale(800000))
    .attr('width', 300)
    .attr('height', 25)
    .attr('fill', 'white') 
    .attr('stroke', 'red'); 

    svg.append('text')
    .attr('x', width - 165) 
    .attr('y', yScale(775000)) 
    .attr('text-anchor', 'end') 
    .text('States under the line have less than 14,000 cases')
    .attr('stroke', 'rgb(0, 0, 0)')
    .attr('stroke-width', 1)
    .style('font-size', '12px')
    .attr('font-style', 'italic');
  
    }
  }

  function createBarGraph2() {
    d3.select('#scene2 svg').remove();
    const states = data.map(d => d.State);
    let med;
    
    if (medData == 0) {
      med = data.map(d => d.Physicians);
    } else if (medData == 1) {
      med = data.map(d => d.Hospitals);
    } else {
      med = data.map(d => d['Health Spending']);
    }

    const statePhysicians = states.map((state, index) => ({ state, med: med[index] }));
  
    statePhysicians.sort((a, b) => a.state.localeCompare(b.state));
  
    const svg = d3.select('#scene2')
      .append('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const tooltip = d3.select('#scene2')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  
    const xScale = d3.scaleBand()
      .domain(statePhysicians.map(d => d.state))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(med) +1])
      .range([height, 0]);
  
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .call(d3.axisLeft(yScale));
  
    svg.selectAll('.bar')
      .data(statePhysicians)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.state))
      .attr('y', d => yScale(d.med))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.med))
      .attr('fill', 'rgb(110, 112, 207)')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('fill', 'orange');
          
        tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      
        tooltip.html(`${d.state}<br>${d.med}`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .attr('fill', 'rgb(110, 112, 207)') 
          tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });


    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.top - 10)
    .style('text-anchor', 'middle')
    .text('State')

    if (medData == 0) {
      svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', -margin.left + 40)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Number of Physicians');
  
      svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Active Physicians per State: 2019');

      svg.append('rect')
      .attr('x', width - 445) 
      .attr('y', yScale(90000))
      .attr('width', 200)
      .attr('height', 50)
      .attr('fill', 'white') 
      .attr('stroke', 'red'); 

      svg.append('text')
      .attr('x', width - 250) 
      .attr('y', yScale(87500)) 
      .attr('text-anchor', 'end') 
      .text('Wide range of physicians per state')
      .attr('stroke', 'rgb(0, 0, 0)')
      .attr('stroke-width', 1)
      .style('font-size', '12px')
      .attr('font-style', 'italic');

      svg.append('text')
      .attr('x', width - 260) 
      .attr('y', yScale(84000)) 
      .attr('text-anchor', 'end') 
      .text('Similar to Total Cases per state')
      .attr('stroke', 'rgb(0, 0, 0)')
      .attr('stroke-width', 1)
      .style('font-size', '12px')
      .attr('font-style', 'italic');

    } else if (medData == 1) {
      svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', -margin.left + 40)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Number of Hospitals');
  
      svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Number of Hospitals per State: 2018');

      svg.append('rect')
      .attr('x', width - 515) 
      .attr('y', yScale(800))
      .attr('width', 275)
      .attr('height', 25)
      .attr('fill', 'white') 
      .attr('stroke', 'red'); 

      svg.append('text')
      .attr('x', width - 250) 
      .attr('y', yScale(775)) 
      .attr('text-anchor', 'end') 
      .text('Varies state to state depending on size of state')
      .attr('stroke', 'rgb(0, 0, 0)')
      .attr('stroke-width', 1)
      .style('font-size', '12px')
      .attr('font-style', 'italic');

    } else {
      svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', -margin.left + 40)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Health Spending per Capita');
  
      svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Health Spending per Capita: 2020');

      svg.append('rect')
      .attr('x', width - 415) 
      .attr('y', yScale(70000))
      .attr('width', 175)
      .attr('height', 25)
      .attr('fill', 'white') 
      .attr('stroke', 'red'); 

      svg.append('text')
      .attr('x', width - 250) 
      .attr('y', yScale(67500)) 
      .attr('text-anchor', 'end') 
      .text('About the same for all states')
      .attr('stroke', 'rgb(0, 0, 0)')
      .attr('stroke-width', 1)
      .style('font-size', '12px')
      .attr('font-style', 'italic');

    }


  }
  function createBarGraph3() {
    d3.select('#scene3 svg').remove();
    const states = data.map(d => d.State);
    let mon;
    
    if (monData == 0) {
      mon = data.map(d => d.Unemployment);
    } else  {
      mon = data.map(d => d.GDP);
    } 
  
    const stateUnemployed = states.map((state, index) => ({ state, mon: mon[index] }));
  
    stateUnemployed.sort((a, b) => a.state.localeCompare(b.state));
  
    const svg = d3.select('#scene3')
      .append('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const tooltip = d3.select('#scene3')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const xScale = d3.scaleBand()
      .domain(stateUnemployed.map(d => d.state))
      .range([0, width])
      .padding(0.1);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(mon)])
      .range([height, 0]);
  
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .call(d3.axisLeft(yScale));
  
    svg.selectAll('.bar')
      .data(stateUnemployed)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.state))
      .attr('y', d => yScale(d.mon))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.mon))
      .attr('fill', 'rgb(35, 197, 89)')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('fill', 'orange');
          
        tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      
        tooltip.html(`${d.state}<br>${d.mon}`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .attr('fill', 'rgb(35, 197, 89)') 
          tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
      
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.top - 10)
    .style('text-anchor', 'middle')
    .text('State')
    
    if (monData == 0) {
      svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', -margin.left + 40)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Unemployment Rate');
  
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Unemployment Rate per State: 2020');
    } else  {
      svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', -margin.left + 40)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('GDP (USD)');
  
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('GDP (USD) per State: 2020');
    } 
  }

  function updateGraphs() {
    createBarGraph1();
    createBarGraph2();
    createBarGraph3();
  }