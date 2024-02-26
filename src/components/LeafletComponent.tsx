import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react"
import L, { Map, Marker as MarkerType } from 'leaflet'
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet"
import { Geolocation } from "@capacitor/geolocation"
import debounce from 'lodash.debounce'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet/dist/leaflet.css'
import MarkerCluster from "./MarkerCluster"

import './leaflet.css'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [35, 46],
  iconAnchor: [17, 46]
})
L.Marker.prototype.options.icon = DefaultIcon

const fillBlueOptions = { fillColor: 'blue' }
const markers = [
  {
    position: { lng: -122.673447, lat: 45.5225581 },
    text: "Voodoo Doughnut"
  },
  {
    position: { lng: -122.6781446, lat: 45.5225512 },
    text: "Bailey's Taproom"
  },
  {
    position: { lng: -122.67535700000002, lat: 45.5192743 },
    text: "Barista"
  },
  {
    position: { lng: -122.65596570000001, lat: 45.5199148000001 },
    text: "Base Camp Brewing"
  }
]

const LeafletComponent = () => {
  const ref = useRef<Map>(null)
  const markerRef = useRef<MarkerType>(null)
  const [center, setCenter] = useState<L.LatLngExpression>({ lat: -3.745, lng: -38.523 })
  const [radius, setRadius] = useState<number>(200)

  useEffect(() => {
    (async () => {
      const coords = await Geolocation.getCurrentPosition()
      const lat = coords.coords.latitude
      const lng = coords.coords.longitude
      setCenter({
        lat: lat,
        lng: lng
      })
      if (!ref.current) return

      const pinMarker = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class='marker-pin'></div>",
        iconSize: [35, 46],
        iconAnchor: [25, 37]
      });

      L.marker([lat, lng], { icon: pinMarker }).addTo(ref.current);

      ref.current?.setView({ lat: lat, lng: lng }, 10)
      ref.current?.on('move', () => {
        if (!ref.current) return
        markerRef.current?.setLatLng(ref.current.getCenter())
      })
      ref.current?.on('dragend', () => {
        if (!markerRef.current) return
        setCenter(markerRef.current.getLatLng())
      })
    })()
  }, [])

  const hdrDragEndRadius = debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(ev.target.value))
  }, 500)

  return (
    <div>
      <form>
        <label>Radius:</label>
        <input type="range" min="200" max="5000" onChange={hdrDragEndRadius}/>
        <input type="submit"></input>
      </form>
      <div
        style={{
          width: 600,
          height: 600,
          overflow: 'hidden',
        }}
      >
        <MapContainer
          ref={ref}
          dragging={true}
          center={center}
          zoom={10}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // TODO: use url from server
          />
          <Marker
            ref={markerRef}
            draggable
            position={center}
          // eventHandlers={eventHandlers}

          />
          <Circle center={center} pathOptions={fillBlueOptions} radius={radius} />
          <MarkerCluster markers={markers} />
        </MapContainer>
      </div>
    </div>
  )
}

export default LeafletComponent