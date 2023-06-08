import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './index.css';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);