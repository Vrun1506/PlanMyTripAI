'use client';

import { AuthenticationType } from 'azure-maps-control';
import React, { useEffect, useRef, useState } from "react";
import * as atlas from "azure-maps-control";

interface AzureMapContentProps {
  points: [number, number][];
  onClick: (index: number) => any;
}

const AzureMapContent: React.FC<AzureMapContentProps> = ({ points, onClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState<atlas.Map | null>(null);
  const [dataSource, setDataSource] = useState<atlas.source.DataSource | null>(null);

  // First useEffect for map initialization
  useEffect(() => {
    if (!mapRef.current) return;

    const newMap = new atlas.Map(mapRef.current, {
      center: [0, 0],
      zoom: 2,
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
  }, []); // Empty dependency array - runs only once

  // Second useEffect for adding points
  useEffect(() => {
    if (!map || !dataSource) return;

    // Clear existing points
    dataSource.clear();

    // Add new points
    points.forEach(([latitude, longitude]) => {
      const point = new atlas.data.Point([latitude, longitude]);
      dataSource.add(point);
    });

    const layer = new atlas.layer.SymbolLayer(dataSource, undefined, {
      iconOptions: {
        color: 'red'
      }
    });

    // Remove any existing layers first
    map.layers.remove(map.layers.getLayerById('pointLayer') || []);

    // Add new layer with a specific ID
    map.layers.add(layer, 'pointLayer');

    const handleClick = (e: any) => {
      if (e.shapes && e.shapes?.length > 0) {
        const shape = e.shapes[0];

        if (!shape.type) {
          const clickedCoords = shape.data.geometry.coordinates;
          points.forEach((coords, index) => {
            // Ensure the coordinates match (with some floating-point tolerance)
            if (
              Math.abs(clickedCoords[0] - coords[0]) < 0.0001 &&
              Math.abs(clickedCoords[1] - coords[1]) < 0.0001
            ) {
              onClick(index);
            }
          })
        } else {
          onClick(-1);
        }
      }
    };

    map.events.add("click", handleClick);

    // Cleanup event listener
    return () => {
      map.events.remove("click", layer, handleClick);
    };

  }, [points, map, dataSource, onClick]); // Added onClick to dependency array

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default AzureMapContent;