import { useEffect, useRef, useState } from "react"
import L, { Map, Marker as MarkerType } from 'leaflet'
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet"
import { Geolocation } from "@capacitor/geolocation"
import debounce from 'lodash.debounce'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet/dist/leaflet.css'
import MarkerCluster from "./MarkerCluster"

import './leaflet.css'
import { isPointWithinRadius } from "geolib"

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
    position: { lng: 106.71182570857603, lat: 10.811046780805261 },
    text: "10, Nguyen Xi"
  },
  {
    position: { lng: 106.700841, lat: 10.811481 },
    text: "Phuong 12, Binh Thanh"
  },
  {
    position: { lng: 106.66663647266905, lat: 10.853182098948148 },
    text: "904 D.Le Duc Tho, Phuong 15, Go Vap"
  },
  {
    position: { lng: 106.69354130003248, lat: 10.824979625230075 },
    text: "366 Đ. Phan Văn Trị, Phường 5, Gò Vấp, Thành phố Hồ Chí Minh, Vietnam"
  }
]

const LeafletComponent = () => {
  const ref = useRef<Map>(null)
  const markerRef = useRef<MarkerType>(null)
  const [center, setCenter] = useState<L.LatLngExpression>({ lat: -3.745, lng: -38.523 })
  const [radius, setRadius] = useState<number>(200)
  const [markercluster, setMarkerCluster] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      const coords = await Geolocation.getCurrentPosition({enableHighAccuracy: true})
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

  useEffect(() => {
    const markerCs: any[] = []
    markers.map(m => {
      if (isPointWithinRadius(m.position, center, radius)) {
        markerCs.push(m)
      }
    })
    setMarkerCluster(markerCs)
  }, [center, radius])

  const hdrChangeRadius = debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(ev.target.value))
  }, 500)

  return (
    <div>
      <form>
        <label>Radius:</label>
        <input type="range" min="200" max="5000" onChange={hdrChangeRadius}/>
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
          <MarkerCluster markers={markercluster} />
        </MapContainer>
      </div>
    </div>
  )
}

export default LeafletComponent