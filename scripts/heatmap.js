// Datos de ejemplo para el mapa de calor circular
const categories = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const hours = Array.from({length: 24}, (_, i) => i);
const data = [];

// Generar datos aleatorios
categories.forEach(category => {
    hours.forEach(hour => {
        data.push({
            category,
            hour,
            value: Math.floor(Math.random() * 100)
        });
    });
});

// Configuración del gráfico
const width = 800;
const height = 800;
const innerRadius = 150;
const outerRadius = Math.min(width, height) / 2 - 50;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

// Crear el elemento SVG
const svg = d3.select("#circular-heatmap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

// Escala de colores
const colorScale = d3.scaleSequential()
    .domain([0, 100])
    .interpolator(d3.interpolatePlasma);

// Escalas angulares y radiales
const x = d3.scaleBand()
    .domain(categories)
    .range([0, 2 * Math.PI]);

const y = d3.scaleRadial()
    .domain([0, 24])
    .range([innerRadius, outerRadius]);

// Crear los segmentos del mapa de calor
svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "segment")
    .attr("d", d3.arc()
        .innerRadius(d => y(d.hour))
        .outerRadius(d => y(d.hour + 1))
        .startAngle(d => x(d.category))
        .endAngle(d => x(d.category) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))
    .attr("fill", d => colorScale(d.value))
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5)
    .on("mouseover", function(event, d) {
        d3.select(this)
            .attr("stroke", "#000")
            .attr("stroke-width", 2);

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);

        tooltip.html(`<strong>${d.category} - ${d.hour}:00</strong><br/>
                     Valor: ${d.value}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
        d3.select(this)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);

        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Crear tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Añadir ejes radiales (horas)
const hourAxis = svg.append("g")
    .selectAll("g")
    .data(y.ticks(6).slice(1))
    .enter()
    .append("g");

hourAxis.append("circle")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-dasharray", "3,3")
    .attr("r", y);

hourAxis.append("text")
    .attr("y", d => -y(d))
    .attr("dy", "0.35em")
    .attr("fill", "#000")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .text(d => `${d}:00`);

// Añadir ejes angulares (días)
const dayAxis = svg.append("g")
    .selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr("text-anchor", d => (x(d) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
    .attr("transform", d => `rotate(${(x(d) + x.bandwidth() / 2) * 180 / Math.PI - 90}) translate(${outerRadius + 10},0)`);

dayAxis.append("line")
    .attr("x2", -5)
    .attr("stroke", "#000");

dayAxis.append("text")
    .attr("transform", d => (x(d) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
    .attr("dy", "0.35em")
    .text(d => d)
    .style("font-size", "12px");

// Añadir leyenda
const legendWidth = 200;
const legendHeight = 20;

const legend = svg.append("g")
    .attr("transform", `translate(${-legendWidth / 2},${outerRadius + 40})`);

const defs = svg.append("defs");

const gradient = defs.append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

gradient.selectAll("stop")
    .data(colorScale.range())
    .enter()
    .append("stop")
    .attr("offset", (d, i) => i / (colorScale.range().length - 1))
    .attr("stop-color", d => d);

legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#gradient)");

const legendScale = d3.scaleLinear()
    .domain(colorScale.domain())
    .range([0, legendWidth]);

const legendAxis = d3.axisBottom(legendScale)
    .ticks(5);

legend.append("g")
    .attr("transform", `translate(0,${legendHeight})`)
    .call(legendAxis)
    .selectAll("text")
    .style("font-size", "10px");
