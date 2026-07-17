// src/data.js
export const AIRPORTS = [
  { code: "LOS", city: "Lagos" },
  { code: "JFK", city: "New York" },
  { code: "LHR", city: "London" },
  { code: "CDG", city: "Paris" },
  { code: "DXB", city: "Dubai" },
  { code: "NBO", city: "Nairobi" },
];

export const AIRLINES = [
  { name: "Meridian Air", code: "MA" },
  { name: "Northbound", code: "NB" },
  { name: "Solray", code: "SR" },
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function genFlights(origin, destination, date) {
  const seed =
    (origin + destination + date)
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
  const rand = seededRandom(seed);
  const count = 5 + Math.floor(rand() * 4);
  const flights = [];

  for (let i = 0; i < count; i++) {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
    const depHour = Math.floor(rand() * 20) + 4;
    const depMin = Math.floor(rand() * 12) * 5;
    const durationH = 2 + Math.floor(rand() * 12);
    const durationM = Math.floor(rand() * 12) * 5;
    const stops = rand() > 0.6 ? 1 : 0;
    const basePrice = Math.round((180 + rand() * 820) / 5) * 5;

    flights.push({
      id: `${origin}${destination}-${i}`,
      airline,
      flightNo: `${airline.code}${100 + Math.floor(rand() * 800)}`,
      depTime: `${String(depHour).padStart(2, "0")}:${String(depMin).padStart(2, "0")}`,
      duration: `${durationH}h ${durationM}m`,
      stops,
      baggage: "1 x 23kg",
      price: basePrice,
    });
  }
  return flights.sort((a, b) => a.price - b.price);
}

export function formatPrice(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}