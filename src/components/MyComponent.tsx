import React from 'react'
import { Circle, GoogleMap, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { Geolocation, Position } from '@capacitor/geolocation';
import { POLYGONS } from './encoded-polygon-data';

const containerStyle = {
  width: '700px',
  height: '700px'
};

// const center = {
//   lat: -3.745,
//   lng: -38.523
// };

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_API_KEY || '',
  })

  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [currentPosition, setPosition] = React.useState<{lat: number;lng:number}>({
    lat: -3.745,
    lng: -38.523
  })
  const [center, setCenter] = React.useState({
    lat: -3.745,
    lng: -38.523
  });
  const [radius, setRadius] = React.useState(500);

  const onLoad = React.useCallback(async function callback(map: google.maps.Map) {

    const coords = await Geolocation.getCurrentPosition()
    const lat = coords.coords.latitude
    const lng = coords.coords.longitude

    const bounds = new window.google.maps.LatLngBounds({
      lat: lat || center.lat,
      lng: lng || center.lng,
    });
    map.fitBounds(bounds);
    setPosition({
      lat: lat || center.lat,
      lng: lng || center.lng, 
    })
    setCenter({
      lat: lat || center.lat,
      lng: lng || center.lng, 
    })
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker
          position={center}
          draggable
          onDragEnd={e =>
            setCenter({lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0})
          }
        />
        <Circle
          radius={radius}
          center={center}
          options={{
            strokeColor: '#0c4cb3',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#3b82f6',
            fillOpacity: 0.3,
          }}
          editable={false}
          draggable={false}
        />
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)