// Datos de ejemplo para el gráfico de dispersión
const data = [
    { x: 10, y: 20, category: "A", size: 15 },
    { x: 15, y: 25, category: "A", size: 20 },
    { x: 20, y: 35, category: "A", size: 25 },
    { x: 25, y: 40, category: "B", size: 30 },
    { x: 30, y: 45, category: "B", size: 35 },
    { x: 35, y: 50, category: "B", size: 40 },
    { x: 40, y: 60, category: "C", size: 45 },
    { x: 45, y: 65, category: "C", size: 50 },
    { x: 50, y: 70, category: "C", size: 55 },
    { x: 55, y: 80, category: "D", size: 60 },
    { x: 60, y: 85, category: "D", size: 65 },
    { x: 65, y: 90, category: "D", size: 70 }
];

// Configuración del gráfico
const margin = { top: 60, right: 120, bottom: 60, left: 60 };
const width = 1200 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Crear el elemento SVG
const svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Escalas
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x) * 1.1])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y) * 1.1])
    .range([height, 0]);

// Escala de colores por categoría
const colorScale = d3.scaleOrdinal()
    .domain(["A", "B", "C", "D"])
    .range(d3.schemeCategory10);

// Escala para el tamaño de los puntos
const sizeScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.size), d3.max(data, d => d.size)])
    .range([5, 20]);

// Ejes
const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickSizeOuter(0);

const yAxis = d3.axisLeft(yScale)
    .ticks(10)
    .tickSizeOuter(0);

// Añadir ejes al SVG
svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

svg.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

// Añadir líneas de cuadrícula
svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale)
        .ticks(10)
        .tickSize(-height)
        .tickFormat(""));

svg.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(yScale)
        .ticks(10)
        .tickSize(-width)
        .tickFormat(""));

// Etiquetas de los ejes
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .style("text-anchor", "middle")
    .text("Variable X");

svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .text("Variable Y");

// Título del gráfico
svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -20)
    .style("text-anchor", "middle")
    .text("Gráfico de Dispersión Interactivo");

// Crear tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Crear los puntos de dispersión
svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", d => sizeScale(d.size))
    .attr("fill", d => colorScale(d.category))
    .on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(100)
            .attr("r", sizeScale(d.size) * 1.5);

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);

        tooltip.html(`Categoría: ${d.category}<br/>
                     Tamaño: ${d.size}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
            .transition()
            .duration(100)
            .attr("r", sizeScale(d.size));

        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Crear leyenda
const legend = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${width + 10},${i * 30})`);

    

legend.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", colorScale);

legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text(d => `Categoría ${d}`)
    .style("font-size", "12px");