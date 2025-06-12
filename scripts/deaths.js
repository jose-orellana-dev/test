const svg = d3.select("svg");
const width = 960;
const height = 600;
const projection = d3.geoMercator().scale(6000).center([-88.9, 13.7]).translate([width / 2, height / 2]);
const pathGenerator = d3.geoPath().projection(projection);

const color = d3.scaleSequential(d3.interpolateReds).domain([0, 1500]);
const tooltip = d3.select(".tooltip");
var geojson;
var data_Deaths = {};

Promise.all([
  d3.json("../sources/es.geo.json"),
  d3.json("../sources/deaths.json")
]).then(([geojson, data]) => {
  const years = Object.keys(data);
  const yearSelect = d3.select("#year");
  years.forEach(year => {
    yearSelect.append("option").attr("value", year).text(year);
  });

  yearSelect.on("change", () => updateMap(yearSelect.node().value));

  updateMap(years[0]);

  function updateMap(year) {
    const deaths = data[year];
    console.log("Datos del GeoJSON:", geojson.features[0].properties);
    
    svg.selectAll("*").remove();

    // Dibujar los departamentos
    svg.selectAll("path")
      .data(geojson.features)
      .join("path")
      .attr("d", pathGenerator)
      .attr("fill", d => {
        const departamento = d.properties.DEPARTAMEN;
        const muertes = deaths[departamento] || 0;
        return color(muertes);
      })
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        const departamento = d.properties.DEPARTAMEN;
        const muertes = deaths[departamento] || 0;
        
        d3.select(event.currentTarget)
          .attr("stroke", "#000")
          .attr("stroke-width", 2);

        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        
        tooltip.html(`
          <strong>${departamento}</strong><br/>
          Muertes: ${muertes}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke", "#333")
          .attr("stroke-width", 1);
        
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Agregar leyenda
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, 20)`);

    const legendScale = d3.scaleLinear()
      .domain([0, 1500])
      .range([0, 100]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5);

    legend.append("g")
      .call(legendAxis);

    // Agregar título
    svg.append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -20)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text(`Muertes por Departamento - ${year}`);
  }
});






/*

console.log(data_Deaths);
const years = Object.keys(data_Deaths);
  const yearSelect = d3.select("#year");
  years.forEach(year => {
    yearSelect.append("option").attr("value", year).text(year);
  });

  yearSelect.on("change", () => updateMap(yearSelect.node().value));
  updateMap(years[0]);

  function updateMap(year) {
    const deaths = data[year];
    svg.selectAll("*").remove();

    svg.selectAll("path")
      .data(geojson.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => {
        const name = d.properties.DEPARTAMEN || d.properties.name;
        const val = deaths[name] || 0;
        return color(val);
      })
      .attr("stroke", "#333")
      .on("mouseover", (event, d) => {
        const name = d.properties.DEPARTAMEN || d.properties.name;
        const val = deaths[name] || 0;
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`<strong>${name}</strong><br>Muertes: ${val}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });
      
  }
      */