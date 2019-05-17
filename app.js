


   //setting up the margins and chartwidth
    const svgWidth = 800;
    const svgHeight = 500;

    const margin = {
        top: 50,
        right: 10,
        bottom: 80,
        left: 90
    };

    const height = svgHeight - margin.top - margin.bottom;
    const width = svgWidth - margin.left - margin.right;
    // console.log(height)
    // console.log(width)

    // append svg and set it up within margin
    const svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    // initial Parameter for x & y and creating scales 
    let chosenXaxis = "poverty"
    let chosenYaxis="healthcare"

    function xScale(csvData,chosenXaxis){
        const xLinearScale = d3.scaleLinear()
                                .domain([d3.min(csvData,d=>d[chosenXaxis]*.8),d3.max(csvData,d=>d[chosenXaxis]*1.2)])
                                .range([0,width])
        return xLinearScale
    }

    function yScale(csvData,chosenYaxis){
        const yLinearScale = d3.scaleLinear()
                                .domain([0,d3.max(csvData,d=>d[chosenYaxis])])
                                .range([height,0])
        return yLinearScale
    }

    //Update Toop tip

    function updateToolTip(chosenXaxis,chosenYaxis,circlesGroup){
            let xlabel =""
            let ylabel =""

            if (chosenXaxis ==="poverty"){
                xlabel = "poverty"
            } else if (chosenXaxis ==="age"){
                xlabel ="age"
            } else if (chosenXaxis ==="income"){
                xlabel ="income"
            }

            if (chosenYaxis ==="healthcare"){
                ylabel = "healthcare"
            } else if (chosenYaxis ==="smokes"){
                ylabel ="smokes"
            } else if (chosenYaxis ==="obesity"){
                ylabel ="obesity"
            }

            const toolTip = d3.tip()
                            .attr("class","d3-tip")
                            .offset([0,-10])
                            .html(function(d){
                                console.log(`${d.state}<br> ${xlabel}: ${d[chosenXaxis]}<br>${ylabel}: ${d[chosenYaxis]}`)
                               return(`${d.state}<br> ${xlabel}: ${d[chosenXaxis]}<br>${ylabel}: ${d[chosenYaxis]}`)
                            
                            })
            circlesGroup.call(toolTip)
            circlesGroup.on("mouseover",function(data){
                toolTip.show(data,this)
            })
                .on("mouseout",function(data){
                    toolTip.hide(data,this)
            })
            return circlesGroup
    }      
    
function renderXAxis(newXScale,xAxis){
        const bottomAxis = d3.axisBottom(newXScale)
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis)
        return xAxis
    }
function renderYAxis(newYScale,yAxis){
    const leftAxis = d3.axisLeft(newYScale)
    yAxis.transition()
        .duration(1000)
        .call(leftAxis)
    return yAxis
}

function renderXCircles(circlesGroup,newXScale,chosenXaxis){
    circlesGroup.transition()
                .duration(1000)
                .attr('cx',d=>newXScale(d[chosenXaxis]))
        return circlesGroup

}
function renderYCircles(circlesGroup,newYScale,chosenYaxis){
    circlesGroup.transition()
                .duration(1000)
                .attr('cy',d=>newYScale(d[chosenYaxis]))
        return circlesGroup

}

    (async function(){
    // data
    const csvData = await d3.csv("data.csv")
    csvData.forEach(d=>{
        d.poverty = +d.poverty
        d.healthcare = +d.healthcare
        d.obesity = +d.obesity
        d.age = +d.age
        d.income = +d.income
        d.smokes = +d.smokes
        d.obesity = + d.obesity
        d.state = d.state

    })
    console.log(csvData)
   
    // scales
    let xLinearScale = xScale(csvData,chosenXaxis)

    let yLinearScale = yScale(csvData,chosenYaxis)
  

    // Create axis functions
    // ==============================
    const bottomAxis = d3.axisBottom(xLinearScale)
    const leftAxis = d3.axisLeft(yLinearScale)

    // Append Axes to the chart
    // ==============================
    let yAxis = chartGroup.append("g").call(leftAxis)

    let xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
   
    // append circles to data points
    let circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXaxis]))
    .attr("cy", d => yLinearScale(d[chosenYaxis]))
    .attr("r", "18px")
    .attr("opacity","0.5")
    .attr("fill", "blue")

    //labels for the x axis
    const xlabelGroup = chartGroup.append('g')
                                .attr("transform",`translate(${width/2},${height+10})`)
    const povertyLabel = xlabelGroup.append("text")
                        .attr("x",0)
                        .attr("y",20)
                        .attr('value','poverty')// grab value for event Listener
                        .classed('active',true)
                        .text("Poverty (%)")
    const ageLabel = xlabelGroup.append("text")
                        .attr("x",0)
                        .attr("y",40)
                        .attr('value','age')// grab value for event Listener
                        .classed('inactive',true)
                        .text("Age (median)")
    const incomeLabel = xlabelGroup.append("text")
                        .attr("x",0)
                        .attr("y",60)
                        .attr('value','income')// grab value for event Listener
                        .classed('inactive',true)
                        .text("Household Income(median)")
    // // //labels for the y axis
    const ylabelGroup = chartGroup.append('g')
                        .attr("transform",'rotate(-90)')

    const healthcareLabel = ylabelGroup.append("text")
                        .attr("x",0 - (height/2))
                        .attr("y",0 - margin.left+50)
                        .attr("dy","1em")
                        .attr('value','healthcare')
                        .classed("active",true)
                        .text("Lacks Healthcare(%)")

    const smokesLabel = ylabelGroup.append("text")
                        .attr("x",0 - (height/2))
                        .attr("y",0 - margin.left +30)
                        .attr("dy","1em")
                        .attr('value','smokes')
                        .classed("inactive",true)
                        .text("Smokes(%)")
    const obesityLabel = ylabelGroup.append("text")
                        .attr("x",0 - (height/2))
                        .attr("y",0 - margin.left + 10)
                        .attr("dy","1em")
                        .attr('value','obesity')
                        .classed("inactive",true)
                        .text("Obesity(%)")
    circlesGroup = updateToolTip(chosenXaxis,chosenYaxis,circlesGroup)
    // //x axis event Listeners
    xlabelGroup.selectAll('text')
            .on('click', function(){
                let value = d3.select(this).attr("value")
                    if (value !== chosenXaxis){
                        chosenXaxis =value
                        console.log(chosenXaxis)
                        xLinearScale = xScale(csvData,chosenXaxis)
                        xAxis = renderXAxis(xLinearScale,xAxis)
                        circlesGroup= renderXCircles(circlesGroup,xLinearScale,chosenXaxis)
                        circlesGroup=updateToolTip(chosenXaxis,chosenYaxis,circlesGroup)
                        if (chosenXaxis ==="poverty"){
                            povertyLabel
                                .classed("active",true)
                                .classed("inactive",false)
                            ageLabel
                                .classed("active",false)
                                .classed("inactive",true)
                            incomeLabel
                                .classed("active",false)
                                .classed("inactive",true)

                        } else if (chosenXaxis ==="age"){
                                povertyLabel
                                    .classed("active",false)
                                    .classed("inactive",true)
                                ageLabel
                                    .classed("active",true)
                                    .classed("inactive",false)
                                incomeLabel
                                    .classed("active",false)
                                    .classed("inactive",true)
                                    
                        } else if (chosenXaxis ==="income"){
                                povertyLabel
                                    .classed("active",false)
                                    .classed("inactive",true)
                                ageLabel
                                    .classed("active",false)
                                    .classed("inactive",true)
                                incomeLabel
                                    .classed("active",true)
                                    .classed("inactive",false)

                        }

                    }
            })
    ylabelGroup.selectAll('text')
    .on('click', function(){
        let value = d3.select(this).attr("value")
            if (value !== chosenYaxis){
                chosenYaxis =value
                console.log(chosenYaxis)
                yLinearScale = yScale(csvData,chosenYaxis)
                yAxis = renderYAxis(yLinearScale,yAxis)
                circlesGroup= renderYCircles(circlesGroup,yLinearScale,chosenYaxis)
                circlesGroup=updateToolTip(chosenXaxis,chosenYaxis,circlesGroup)
                if (chosenYaxis ==="healthcare"){
                    healthcareLabel
                        .classed("active",true)
                        .classed("inactive",false)
                    smokesLabel
                        .classed("active",false)
                        .classed("inactive",true)
                    obesityLabel
                        .classed("active",false)
                        .classed("inactive",true)

                } else if (chosenYaxis ==="smokes"){
                        healthcareLabel
                            .classed("active",false)
                            .classed("inactive",true)
                        smokesLabel
                            .classed("active",true)
                            .classed("inactive",false)
                        obesityLabel
                            .classed("active",false)
                            .classed("inactive",true)
                            
                } else if (chosenYaxis ==="obesity"){
                        healthcareLabel
                            .classed("active",false)
                            .classed("inactive",true)
                        smokesLabel
                            .classed("active",false)
                            .classed("inactive",true)
                        obesityLabel
                            .classed("active",true)
                            .classed("inactive",false)

                }
            }
    })

  


    })()

























