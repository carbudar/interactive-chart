  const getData = async() => {
    const data = await d3.json('https://data.cityofnewyork.us/resource/uvpi-gqnh.json')
    console.log(data)
    return data; 
};

//calculate total number of tree per borough
getData().then(data => {
    let manhattan = 0;
    let brooklyn = 0; 
    let statenIsland = 0; 
    let bronx = 0; 
    let queens = 0; 
    let others = 0; 
    
    data.forEach((tree) => {
        if( tree.boroname == "Manhattan"){
            manhattan +=1; 
        }else if( tree.boroname == "Brooklyn"){
            brooklyn +=1; 
        }else if( tree.boroname == "Staten Island"){
            statenIsland +=1; 
        }else if( tree.boroname == "Bronx"){
            bronx +=1; 
        }else if( tree.boroname == "Queens"){
            queens +=1; 
        }else{
            others +=1; 
        }
    })

// getData();

const dataset = [manhattan,brooklyn,statenIsland,bronx,queens,others];
const boroughs = ["Manhattan", "Brooklyn", "Staten Island", "Bronx","Queens","Others"]; 


const svgWidth = 700;
const svgHeight = 500;

const margin = {
    top:20,
    bottom:30,
    left:40,
    right:20
}

const width = svgWidth - margin.left - margin.right; 
const height = svgHeight - margin.top - margin.bottom; 


//svg container
const svg = d3.select('#graph')
.append('svg')
.attr('width', svgWidth)
.attr('height', svgHeight)
.style('border', '1px dotted green')//border
.append('g')
.attr('transform', `translate(${margin.left}, ${margin.right})`)


//x scale (boroughs)
const x = d3.scaleBand() // for cateogorical data 
                .domain(boroughs) 
                .range([0, width])
                .padding(0.1);

//y scale (number value)
const y = d3.scaleLinear() // for quantitative data 
                .domain([0, d3.max(dataset)])
                .range([height, 0])

    
    //make bars for data
    svg.selectAll('.bar')
    .data(dataset)
    .enter()
    .append('rect') //make bar shapes
    .attr('class', 'bar')
    .attr('x', (data, index) => x(boroughs[index])) //x axis
    .attr('y', (data) => y(data)) //y axis
    .attr('width', x.bandwidth())//width of x axis
    .attr('height',(data) => height-y(data)) //height of y axis
    .attr("fill", "#7e8e20")

    //transition
    .on('mouseover', function(event, d){
        console.log(d)
        d3.select(this).transition()
                        .duration(50)
                        .attr('fill', '#b6ca93')
        
        svg.append('text')
           .attr('class', 'hover-text')
           .attr('x', parseFloat(d3.select(this).attr('x')) + x.bandwidth() /2)
           .attr('y', parseFloat(d3.select(this).attr('y')) + (height - y(d)) / 2)
           .attr('text-anchor', 'middle')
           .attr('font-size', '20px')
           .attr('fill','#7e8e20')
           .text(d);
    })
    .on('mouseout', function(event, d) {
        d3.select(this).transition()
        .duration(50)
        .attr("fill", "#7e8e20")

    svg.selectAll('.hover-text').remove();
    })



    
    // x axis
svg.append('g')
.attr('transform', `translate(0,${height})`)
 .call(d3.axisBottom(x))
// y axis
svg.append('g')
 .call(d3.axisLeft(y))


});