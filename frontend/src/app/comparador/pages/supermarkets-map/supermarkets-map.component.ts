import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { LngLat } from 'mapbox-gl';
import * as mapboxgl from 'mapbox-gl';

interface Supermarket {
  id: number;
  name: string;
  coordinates: [number, number];
  distance: number;
}

@Component({
  selector: 'app-supermarkets-map',
  templateUrl: './supermarkets-map.component.html',
  styleUrls: ['./supermarkets-map.component.scss']
})
export class SupermarketsMapComponent implements OnInit, OnDestroy {
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  /* Santiago Chile */
  lat = -33.4372;
  lng = -70.6506;

  maxDistance = 3000;
  supermarketsFound: Supermarket[] = [];
  searchedSupermarkets: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 15,
      center: [this.lng, this.lat]
    });

    // GeolocateControl
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });

    this.map.addControl(geolocate);

    // Create a marker and add it to the map at the user's current location
    geolocate.on('geolocate', (e: any) => {
      const lon = e.coords.longitude;
      const lat = e.coords.latitude;
      this.lat = lat;
      this.lng = lon;
      const userPosition: [number, number] = [lon, lat];

      // Check if supermarkets were already searched
      if (!this.searchedSupermarkets) {
        const supermarketNames = ['Santa Isabel', 'Unimarc', 'Jumbo'];
        
        const supermarketIds: { [name: string]: number } = {
          'Santa Isabel': 1,
          'Jumbo': 2,
          'Unimarc': 3
        };

        supermarketNames.forEach(supermarketName => {
          const query = `${supermarketName}`;

          const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${environment.mapbox.accessToken}&proximity=${userPosition[0]},${userPosition[1]}`;

          this.http.get(geocodeUrl).subscribe((response: any) => {
            const features = response.features;
            const closestSupermarket = features[0];

            if (closestSupermarket) {
              const supermarketCoordinates: [number, number] = closestSupermarket.center;

              // Calculate the distance
              const userPositionLngLat = new LngLat(userPosition[0], userPosition[1]);
              const supermarketPositionLngLat = new LngLat(supermarketCoordinates[0], supermarketCoordinates[1]);
              const distance = userPositionLngLat.distanceTo(supermarketPositionLngLat);

              // Check if the supermarket is within the maximum distance
              if (distance <= this.maxDistance) {
                // Save the supermarket to the list
                const id = supermarketIds[supermarketName];
                
                this.supermarketsFound.push({
                  id: id,
                  name: closestSupermarket.place_name,
                  coordinates: supermarketCoordinates,
                  distance: distance
                });

                // Mark the supermarket on the map
                new mapboxgl.Marker({ color: 'red' })
                  .setLngLat(supermarketCoordinates)
                  .addTo(this.map);
              }
            }
          });
        });
        
        this.supermarketsFound.sort((a, b) => a.distance - b.distance); // Ordenar la lista

        this.searchedSupermarkets = true;
      }
    });

    // Trigger geolocation when the map is loaded
    this.map.on('load', () => {
      geolocate.trigger();
    });
  }
  
  ngOnDestroy() {
    this.map.remove();
  }
}
