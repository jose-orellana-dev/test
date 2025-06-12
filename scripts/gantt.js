// Datos de ejemplo para el diagrama de Gantt
const tasks = [
    { id: 1, name: "Investigación",descripcion:"DESCRIPCION", start: new Date(2023, 0, 1), end: new Date(2023, 0, 15) },
    { id: 2, name: "Diseño",descripcion:"DESCRIPCION", start: new Date(2023, 0, 10), end: new Date(2023, 0, 25) },
    { id: 3, name: "Desarrollo",descripcion:"DESCRIPCION", start: new Date(2023, 0, 20), end: new Date(2023, 1, 10) },
    { id: 4, name: "Pruebas",descripcion:"DESCRIPCION", start: new Date(2023, 1, 5), end: new Date(2023, 1, 20) },
    { id: 5, name: "Implementación",descripcion:"DESCRIPCION", start: new Date(2023, 1, 15), end: new Date(2023, 2, 1) }
];

// Configuración del gráfico
const margin = { top: 50, right: 50, bottom: 50, left: 150 };
const width = 1200 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Crear el elemento SVG
const svg = d3.select("#gantt-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Escalas
const xScale = d3.scaleTime()
    .domain([d3.min(tasks, d => d.start), d3.max(tasks, d => d.end)])
    .range([0, width]);

const yScale = d3.scaleBand()
    .domain(tasks.map(d => d.name))
    .range([0, height])
    .padding(0.2);

// Ejes
svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale)
        .ticks(d3.timeDay.every(3))
        .tickFormat(d3.timeFormat("%d %b")));

svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yScale));

// Etiquetas de los ejes
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .style("text-anchor", "middle")
    .text("Fecha");

svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .text("Tareas");

// Barras del Gantt
svg.selectAll(".bar")
    .data(tasks)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.start))
    .attr("y", d => yScale(d.name))
    .attr("width", d => xScale(d.end) - xScale(d.start))
    .attr("height", yScale.bandwidth())
    .attr("rx", 3) // Bordes redondeados
    .attr("ry", 3);

// Etiquetas de tareas (opcional)
svg.selectAll(".task-label")
    .data(tasks)
    .enter()
    .append("text")
    .attr("class", "task-label")
    .attr("x", d => xScale(d.start) + 5)
    .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2 + 5)
    .text(d => d.name);

// Título
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Diagrama de Gantt del Proyecto");