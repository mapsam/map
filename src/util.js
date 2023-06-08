import { pointToTile } from '@mapbox/tilebelt';

export function round(val, dec = 10000) {
  return Math.round(val * dec) / dec;
}

export function getTile({ lng, lat }, zoom) {
  const zoomInt = Math.floor(zoom);
  const [x, y, z] = pointToTile(lng, lat, zoomInt);
  return `${z}/${x}/${y}`;
}