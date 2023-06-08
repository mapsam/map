import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from 'mapbox-gl-geocoder';
import SphericalMercator from '@mapbox/sphericalmercator';
import { round, getTile } from './util';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwc2FtIiwiYSI6ImNqNG9na3J3dDBhOGczM3Jyb3IxcTllazIifQ.F5FwYdNdKrx2l_0tKnip0Q';
const sm = new SphericalMercator();

function App() {
  const mapRef = useRef();
  const markerRef = useRef();
  const containerRef = useRef();
  const [ lng, setLng ] = useState();
  const [ lat, setLat ] = useState();
  const [ zoom, setZoom ] = useState();
  const [ tile, setTile ] = useState();
  const [ markerLng, setMarkerLng ] = useState();
  const [ markerLat, setMarkerLat ] = useState();
 
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [23.5662, 37.9847],
      zoom: 9.5,
      hash: true
    });
    mapRef.current.showTileBoundaries = true;
    mapRef.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
      })
    );

    const loadedCenter = mapRef.current.getCenter();
    const loadedZoom = mapRef.current.getZoom();
    setLng(round(loadedCenter.lng));
    setMarkerLng(round(loadedCenter.lng));
    setLat(round(loadedCenter.lat));
    setMarkerLat(round(loadedCenter.lat));
    setZoom(round(loadedZoom, 100));
    setTile(getTile(loadedCenter, loadedZoom));

    markerRef.current = new mapboxgl.Marker({ color: '#000000' })
      .setLngLat([loadedCenter.lng, loadedCenter.lat])
      .addTo(mapRef.current);

    mapRef.current.on('move', () => {
      const center = mapRef.current.getCenter();
      setLng(round(center.lng));
      setLat(round(center.lat));
      setZoom(round(mapRef.current.getZoom(), 100));
    });

    mapRef.current.on('click', ({ lngLat }) => {
      markerRef.current.setLngLat(lngLat);
      const tile = getTile(lngLat, mapRef.current.getZoom());
      setTile(tile);
      setMarkerLng(round(lngLat.lng));
      setMarkerLat(round(lngLat.lat));
    });
  }, []);

  function goToLngLat(e) {
    if (e.key === 'Enter') {
      mapRef.current.setCenter(e.target.value.trim().split(','));
    }
  }

  function goToTile(e) {
    if (e.key === 'Enter') {
      const [z, x, y] = e.target.value.trim().split('/');
      mapRef.current.fitBounds([...sm.bbox(x, y, z)], { linear: true, duration: 0 });
    }
  }

  return (
    <div className="App">
      <div ref={containerRef} className="map"></div>
      <div id="info">
        <strong className='text-light'>map info</strong><br />
        zoom: {zoom},<br />
        center: [{lng}, {lat}]<br />
        <br />
        <strong className='text-light'>click info</strong> (
          <a href={`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/${tile}.vector.pbf?access_token=${mapboxgl.accessToken}`} target="_blank">mvt</a>, 
          <a href={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/${tile}?access_token=${mapboxgl.accessToken}`} target="_blank">png</a>
        )<br />
        tile: {tile}<br />
        marker: [{markerLng}, {markerLat}]
        <br />
        <br />
        <strong className='text-light'>find it</strong><br />
        <div className="fields">
          <input type="text" onKeyDown={goToLngLat} placeholder="lng,lat" />
          <input type="text" onKeyDown={goToTile} id="zxyinput" placeholder="z/x/y" />
        </div>
      </div>
    </div>
  );
}

export default App;