
import type { BirthChartResponse } from "../services/chartService";

export const getChartValue = (
  chart: BirthChartResponse,
  key: string
): string => {
  return (
    chart.chart_facts.find((fact) => fact.fact_key === key)?.fact_value ?? "—"
  );
};

export const getPlanetData = (chart: BirthChartResponse) => {
  const planets = [
    "sun",
    "moon",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
    "rahu",
    "ketu",
  ];

  return planets.map((planet) => ({
    name: planet.charAt(0).toUpperCase() + planet.slice(1),
    sign: getChartValue(chart, `${planet}.sign`),
    degree: getChartValue(chart, `${planet}.degree`),
    house: getChartValue(chart, `${planet}.house`),
    retrograde: getChartValue(chart, `${planet}.retrograde`) === "True",
  }));
};
