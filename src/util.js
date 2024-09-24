import { pointToTile, tileToQuadkey } from '@mapbox/tilebelt';

export function round(val, dec = 10000) {
  return Math.round(val * dec) / dec;
}

export function getTileInfo({ lng, lat }, zoom) {
  const zoomInt = Math.floor(zoom);
  const tile = pointToTile(lng, lat, zoomInt);
  const quadkey = tileToQuadkey(tile);
  return { 
    tile: `${tile[2]}/${tile[0]}/${tile[1]}`, 
    quadkey,
  };
}
