'use client';

import { AuthenticationType } from 'azure-maps-control';
import React, { useEffect, useRef, useState } from "react";
import * as atlas from "azure-maps-control";

interface AzureMapContentProps {
  points: [number, number][];
  onClick: (index: number) => any;
}

const AzureMapContent: React.FC<AzureMapContentProps> = ({ points, onClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<atlas.Map | null>(null);
  const [dataSource, setDataSource] = useState<atlas.source.DataSource | null>(null);
  const prevPointsRef = useRef<[number, number][]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const newMap = new atlas.Map(mapRef.current, {
      center: [0, 0],
      zoom: 1,
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY!
      },
    });

    newMap.events.add("ready", () => {
      const newDataSource = new atlas.source.DataSource();
      newMap.sources.add(newDataSource);
      setMap(newMap);
      setDataSource(newDataSource);
    });

    return () => {
      newMap.dispose();
    };
  }, []);

  useEffect(() => {
    if (!map || !dataSource) return;

    // Clear any previously added data.
    dataSource.clear();

    // Add each point feature.
    points.forEach(([latitude, longitude]) => {
      const point = new atlas.data.Point([latitude, longitude]);
      dataSource.add(point);
    });

    // Remove the existing points layer if it exists.
    if (map.layers.getLayerById('pointLayer')) {
      map.layers.remove(map.layers.getLayerById('pointLayer'));
    }

    // Add a new symbol layer for the points.
    const pointLayer = new atlas.layer.SymbolLayer(dataSource, 'pointLayer');
    map.layers.add(pointLayer);

    // If there are at least two points, add a polyline that connects them.
    if (points.length > 1) {
      // Create a LineString from the points.
      // IMPORTANT: Ensure that your points are in [longitude, latitude] order!
      const lineString = new atlas.data.LineString(points);

      // Add the line feature to the data source.
      dataSource.add(lineString);

      // Remove an existing line layer if it exists.
      if (map.layers.getLayerById("lineLayer")) {
        map.layers.remove(map.layers.getLayerById("lineLayer"));
      }

      // Create and add the line layer with custom styling.
      const lineLayer = new atlas.layer.LineLayer(dataSource, "lineLayer", {
        strokeColor: "blue",
        strokeWidth: 2,
        lineJoin: "round"
      });
      map.layers.add(lineLayer);
    }

    // Handle clicks on features.
    const handleClick = (e: any) => {
      if (e.shapes && e.shapes.length > 0) {
        const shape = e.shapes[0];
        if (!shape.type) {
          const clickedCoords = shape.data.geometry.coordinates;
          points.forEach((coords, index) => {
            if (
              Math.abs(clickedCoords[0] - coords[0]) < 0.0001 &&
              Math.abs(clickedCoords[1] - coords[1]) < 0.0001
            ) {
              onClick(index);
            }
          });
        } else {
          // Clicked on something else (e.g., the line)
          onClick(-1);
        }
      }
    };

    map.events.add("click", handleClick);

    return () => {
      map.events.remove("click", handleClick);
    };
  }, [points, map, dataSource, onClick]);

  useEffect(() => {
    if (JSON.stringify(prevPointsRef.current) === JSON.stringify(points)) {
      return;
    }
    prevPointsRef.current = points;

    if (points.length > 0) {
      let sumLat = 0;
      let sumLon = 0;
      points.forEach(([lat, lon]) => {
        sumLat += lat;
        sumLon += lon;
      });
      const avgLat = sumLat / points.length;
      const avgLon = sumLon / points.length;

      map?.setCamera({
        center: [avgLat, avgLon],
        zoom: 4,
        type: "fly"
      });
    }
  }, [points, map]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default AzureMapContent;
