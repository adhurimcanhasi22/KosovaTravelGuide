import { MapContainer, Marker, TileLayer, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility'; // This handles default marker icons
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet'; // Import Leaflet library itself for custom icons
// Removed direct lucide-react imports as we're embedding SVG paths directly now
// import { MapPin, Hotel, Landmark } from 'lucide-react'; // Import icons for different marker types

export default function MyMap(props) {
  const { position, zoom, cities = [], hotels = [] } = props;

  // Create a mapping from city names to their coordinates for easy lookup
  const cityCoordinatesMap = new Map();
  cities.forEach((city) => {
    if (city.name && city.coordinates && city.coordinates.length === 2) {
      cityCoordinatesMap.set(city.name.toLowerCase(), city.coordinates);
    }
  });

  // Custom icon for cities/monuments (using a distinct map pin SVG)
  const cityIcon = new L.DivIcon({
    html: `
      <div class="bg-blue-600 text-white rounded-full p-1 shadow-lg flex items-center justify-center" style="width: 30px; height: 30px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
          <path d="M12 18.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30], // Adjust anchor to point to the bottom center of the icon
    popupAnchor: [0, -20],
  });

  // Custom icon for hotels (using a distinct building SVG)
  const hotelIcon = new L.DivIcon({
    html: `
      <div class="bg-green-600 text-white rounded-full p-1 shadow-lg flex items-center justify-center" style="width: 30px; height: 30px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building">
          <path d="M2 22h20V2H2zm2-2v-2h16v2zm0-4v-2h16v2zm0-4v-2h16v2zm0-4V6h16v2z"/>
        </svg>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -20],
  });

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render Markers for Cities/Destinations */}
      {cities.map(
        (city) =>
          city.coordinates &&
          city.coordinates.length === 2 && (
            <Marker key={city.slug} position={city.coordinates} icon={cityIcon}>
              <Popup>
                <div className="font-semibold text-lg">{city.name}</div>
                <div className="text-sm text-gray-700">{city.description}</div>
                <a
                  href={`/destinations/${city.slug}`}
                  className="text-blue-600 hover:underline text-sm mt-1 block"
                >
                  View Details
                </a>
              </Popup>
              <Tooltip>{city.name}</Tooltip>
            </Marker>
          )
      )}

      {/* Render Markers for Hotels */}
      {hotels.map((hotel) => {
        const cityCoord = cityCoordinatesMap.get(hotel.location.toLowerCase());
        if (cityCoord) {
          // Offset the hotel marker slightly if it's in the same exact spot as a city marker
          // This creates a small cluster effect for overlapping markers
          const hotelOffset = [cityCoord[0] + 0.001, cityCoord[1] + 0.001];
          return (
            <Marker key={hotel.id} position={hotelOffset} icon={hotelIcon}>
              <Popup>
                <div className="font-semibold text-lg">{hotel.name}</div>
                <div className="text-sm text-gray-700">Type: {hotel.type}</div>
                <div className="text-sm text-gray-700">
                  Price: €{hotel.price}/night
                </div>
                <div className="text-sm text-gray-700">
                  Rating: {hotel.rating}/5
                </div>
                {hotel.bookingUrl && (
                  <a
                    href={hotel.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-1 block"
                  >
                    Book Now
                  </a>
                )}
              </Popup>
              <Tooltip>{hotel.name}</Tooltip>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}
