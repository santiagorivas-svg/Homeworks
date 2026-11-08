import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const initialData = {
  cities: [
    { id: 'city_1', name: 'Madrid' },
    { id: 'city_2', name: 'Bogotá' },
    { id: 'city_3', name: 'Ciudad de México' }
  ],
  people: [
    { id: 'p_1', name: 'Ana', age: 28, cityId: 'city_1' },
    { id: 'p_2', name: 'Carlos', age: 34, cityId: 'city_1' },
    { id: 'p_3', name: 'Beatriz', age: 22, cityId: 'city_2' },
    { id: 'p_4', name: 'Daniel', age: 30, cityId: 'city_3' },
    { id: 'p_5', name: 'Elena', age: 25, cityId: 'city_2' }
  ]
};

export const Challenge11 = () => {
  const svgRef = useRef(null);
  const [selectedCityId, setSelectedCityId] = useState('city_1');

  useEffect(() => {
    const width = 600;
    const height = 400;

    const nodes = [
      ...initialData.cities.map(c => ({ id: c.id, label: `${c.name} (Ciudad)`, type: 'city', cityId: c.id })),
      ...initialData.people.map(p => ({ id: p.id, label: `${p.name} (${p.age}a)`, type: 'person', cityId: p.cityId }))
    ];

    const links = initialData.people.map(p => ({ source: p.id, target: p.cityId, cityId: p.cityId }));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Simulación de fuerzas
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    // Dibujar enlaces (líneas)
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => d.cityId === selectedCityId ? '#ff8c00' : '#ddd') // Resalta las líneas de la ciudad elegida
      .attr('stroke-width', d => d.cityId === selectedCityId ? 3 : 1)
      .attr('opacity', d => d.cityId === selectedCityId ? 1 : 0.3);

    // Dibujar nodos (círculos y texto)
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      // Permitir hacer clic directo en una ciudad en el grafo para seleccionarla
      .on('click', (event, d) => {
        if (d.type === 'city') setSelectedCityId(d.id);
      });

    // Círculos
    node.append('circle')
      .attr('r', d => {
        const isSelected = d.cityId === selectedCityId;
        if (d.type === 'city') return isSelected ? 26 : 18;
        return isSelected ? 16 : 10;
      })
      .attr('fill', d => {
        const isSelected = d.cityId === selectedCityId;
        if (d.type === 'city') return isSelected ? '#ff4d4d' : '#ffb3b3';
        return isSelected ? '#4da6ff' : '#b3d9ff';
      })
      .attr('stroke', d => d.cityId === selectedCityId ? '#333' : 'none')
      .attr('stroke-width', 2);

    // Etiqueta de texto
    node.append('text')
      .text(d => d.label)
      .attr('x', 20)
      .attr('y', 5)
      .attr('font-size', d => d.cityId === selectedCityId ? '13px' : '11px')
      .attr('font-weight', d => d.cityId === selectedCityId ? 'bold' : 'normal')
      .attr('fill', d => d.cityId === selectedCityId ? '#000' : '#888');

    // Restricciones de pantalla
    simulation.on('tick', () => {
      node.attr('transform', d => {
        const r = d.type === 'city' ? 26 : 16;
        d.x = Math.max(r, Math.min(width - r - 130, d.x));
        d.y = Math.max(r, Math.min(height - r, d.y));
        return `translate(${d.x},${d.y})`;
      });

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    });

    return () => simulation.stop();
  }, [selectedCityId]); // Se ejecuta cada vez que cambia la ciudad seleccionada

  const peopleInSelectedCity = initialData.people.filter(p => p.cityId === selectedCityId);
  const selectedCityName = initialData.cities.find(c => c.id === selectedCityId)?.name;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Grafo de Personas y Ciudades</h2>

      <svg
        ref={svgRef}
        width={600}
        height={400}
        style={{ border: '1px solid #ccc', borderRadius: '8px', background: '#fafafa' }}
      />

      <hr style={{ margin: '20px 0' }} />

      <div>
        <h3>Lista de personas por ciudad</h3>
        <label htmlFor="city-select">Selecciona una ciudad: </label>
        <select
          id="city-select"
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
          style={{ padding: '5px 10px', marginLeft: '10px' }}
        >
          {initialData.cities.map(city => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        <h4 style={{ marginTop: '15px' }}>
          Habitantes en {selectedCityName}:
        </h4>
        <ul>
          {peopleInSelectedCity.map(person => (
            <li key={person.id}>
              <strong>{person.name}</strong> — {person.age} años
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};