const GEO_API_KEY = "bbedd713281e4bd7b7204ec11cedfeb0"; // ⚠️ move key to variable

export function getMapPreview(lat, lng) {
  return `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=300&center=lonlat:${lng},${lat}&zoom=13&marker=lonlat:${lng},${lat};color:red&apiKey=${GEO_API_KEY}`;
}


export async function getAddress(lat, lng) {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEO_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch address!");
  }

  const data = await response.json();

  return data.features[0].properties.formatted;
}