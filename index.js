var SM = require('@mapbox/sphericalmercator');
var tilebelt = require('@mapbox/tilebelt');

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwc2FtIiwiYSI6ImNqNG9na3J3dDBhOGczM3Jyb3IxcTllazIifQ.F5FwYdNdKrx2l_0tKnip0Q';
var ZOOM = document.getElementById('zoom');
var LNG = document.getElementById('lng');
var LAT = document.getElementById('lat');
var TILE = document.getElementById('tile');
var MARKER_LAT = document.getElementById('marker-lat');
var MARKER_LNG = document.getElementById('marker-lng');
var DOWNLOAD = document.getElementById('download');
var INPUT_LNGLAT = document.getElementById('lnglatinput');
var INPUT_ZXY = document.getElementById('zxyinput');

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [13.3288, 49.9165],
    zoom: 3.5,
    hash: true
});

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false
  })
);

var markerEl = document.getElementById('marker');
var marker = new mapboxgl.Marker(markerEl).setLngLat([0,0]).addTo(map);

map.showTileBoundaries = true;

INPUT_LNGLAT.addEventListener('keypress', function(e) {
  if (e.keyCode === 13) {
    var val = this.value;
    val = val.replace(/\s/g, '');
    vala = val.split(',');
    if (vala.length !== 2) return;
    map.setCenter(vala);
  }
});
INPUT_ZXY.addEventListener('keypress', function(e) {
  if (e.keyCode === 13) {
    var val = this.value.trim();
    var tile = val.split('/');
    if (tile.length !== 3) return;
    var sm = new SM();
    console.log('tile', tile);
    var bbox = sm.bbox(tile[1], tile[2], tile[0]);
    console.log(bbox);
    map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { linear: true, duration: 0 });
  }
});

map.on('load', function(e) {
  ZOOM.innerHTML = getZoom(map);
  LNG.innerHTML = getLng(map.getCenter());
  LAT.innerHTML = getLat(map.getCenter());
});

map.on('zoom', function(e, z) {
  ZOOM.innerHTML = getZoom(map);
});

map.on('move', function(e, z) {
  LNG.innerHTML = getLng(map.getCenter());
  LAT.innerHTML = getLat(map.getCenter());
});

map.on('click', function(e) {
  marker.setLngLat(e.lngLat);

  var zoom = Math.floor(map.getZoom());
  var xy = tilebelt.pointToTile(e.lngLat.lng, e.lngLat.lat, zoom);
  var tile = `${zoom}/${xy[0]}/${xy[1]}`;
  TILE.innerHTML = tile;

  MARKER_LNG.innerHTML = getLng(e.lngLat);
  MARKER_LAT.innerHTML = getLat(e.lngLat);

  var download_vt_url = `https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/${tile}.vector.pbf?access_token=${mapboxgl.accessToken}`;
  var download_vt_html = `<a href="${download_vt_url}">vt</a>, `;
  var download_png_url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/${tile}?access_token=${mapboxgl.accessToken}`;
  var download_png_html = `<a href="${download_png_url}">png</a>`;
  DOWNLOAD.innerHTML = download_vt_html + download_png_html;
});

function getZoom(m) {
  return Math.floor(m.getZoom() * 100) / 100;
}

function getLng(ll) {
  return Math.floor(ll.lng * 10000) / 10000;
}

function getLat(ll) {
  return Math.floor(ll.lat * 10000) / 10000;
}
