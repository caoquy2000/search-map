import { useEffect, useMemo, useRef, useState } from "react"
import L, { Map, Marker as MarkerType } from 'leaflet'
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet"
import { Geolocation } from "@capacitor/geolocation"

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet/dist/leaflet.css'
import MarkerCluster from "./MarkerCluster"

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
  const [center, setCenter] = useState<L.LatLngExpression>({lat: -3.745, lng: -38.523})

  useEffect(() => {
    (async () => {
      const coords = await Geolocation.getCurrentPosition()
      const lat = coords.coords.latitude
      const lng = coords.coords.longitude
      setCenter({
        lat: lat,
        lng: lng
      })
      ref.current?.setView({lat: lat, lng: lng}, 10)
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
  console.log('center', center)
  // const eventHandlers = useMemo(
  //   () => ({
  //     dragend() {
  //       const marker = markerRef.current
  //       if (marker != null) {
  //         setCenter(marker.getLatLng())
  //       }
  //     },
  //   }),
  //   [],
  // )


  return (
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
        <Circle center={center} pathOptions={fillBlueOptions} radius={200} />
        <MarkerCluster markers={markers} />
      </MapContainer>
    </div>
  )
}

export default LeafletComponent