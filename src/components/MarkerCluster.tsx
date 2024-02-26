import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40]
});


const mcg = L.markerClusterGroup()

const MarkerCluster = ({ markers }: any) => {
  const map = useMap()

  useEffect(() => {
    mcg.clearLayers();
    markers.forEach(({ position, text }: any) =>
      L.marker(new L.LatLng(position.lat, position.lng), {
        icon: customMarker
      })
        .addTo(mcg)
        .bindPopup(text)
    );

    map.addLayer(mcg);
  }, [markers])

  return null
}

export default MarkerCluster