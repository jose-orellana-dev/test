// Datos de ejemplo para el gráfico de pastel
const data = [
    { label: "Tecnología", value: 35 },
    { label: "Salud", value: 25 },
    { label: "Educación", value: 20 },
    { label: "Manufactura", value: 15 },
    { label: "Otros", value: 5 }
];

// Configuración del gráfico
const width = 600;
const height = 400;
const radius = Math.min(width, height) / 2 - 40;
const margin = { top: 0, right: 40, bottom: 40, left: 40 };

// Crear el elemento SVG
const svg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

// Escala de colores
const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(d3.schemeCategory10);

// Generador de arcos
const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

// Generador de sectores
const pie = d3.pie()
    .value(d => d.value)
    .sort(null);

// Crear tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Dibujar los sectores
const arcs = svg.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

// Añadir los paths (sectores)
arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .on("mouseover", function(event, d) {
        d3.select(this).transition()
            .duration(200)
            .attr("d", d3.arc()
                .innerRadius(0)
                .outerRadius(radius * 1.05)(d));

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        
        const percentage = (d.data.value / d3.sum(data, d => d.value) * 100);
        tooltip.html(`${d.data.label}<br>${d.data.value} (${percentage.toFixed(1)}%)`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
        d3.select(this).transition()
            .duration(200)
            .attr("d", arc(d));
        
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Añadir etiquetas de texto
arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("dy", "0.35em")
    .text(d => {
        const percentage = (d.data.value / d3.sum(data, d => d.value) * 100).toFixed(1);
        return `${percentage}%`;
    })
    .style("text-anchor", "middle")
    .style("font-size", "12px");

    svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width * 0.2)
    .attr("y", -height / 2 + margin.top + 30)
    .attr("text-anchor", "middle")
    .text("Distribución por Sectores")
    .style("font-size", "22px");

// Crear leyenda
const legend = svg.selectAll(".legend")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${radius + 30},${i * 20 - radius / 2})`);

legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", d => color(d.label));

legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text(d => d.label)
    .style("font-size", "12px");