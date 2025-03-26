'use client';

import { AuthenticationType } from 'azure-maps-control';
import React, { useEffect, useRef } from "react";
import * as atlas from "azure-maps-control";

interface AzureMapContentProps {
  points: [number, number][];
}

const AzureMapContent: React.FC<AzureMapContentProps> = ({ points }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new atlas.Map(mapRef.current, {
      center: [0, 0],
      zoom: 2,
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY!
      },
    });

    map.events.add("ready", () => {
      const dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);

      points.forEach(([latitude, longitude]) => {
        dataSource.add(new atlas.data.Point([latitude, longitude]));
      });

      const layer = new atlas.layer.SymbolLayer(dataSource, undefined, {
        iconOptions: {
          color: 'red'
        }
      });
      map.layers.add(layer);

      map.events.add("click", layer, (e) => {
        console.log("Point clicked:", e);
      });
    });

    return () => map.dispose();
  }, [points]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default AzureMapContent;