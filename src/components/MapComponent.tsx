'use client';

import { AzureMapsProvider, AzureMap } from 'react-azure-maps';
import { AuthenticationType } from 'azure-maps-control';

const option = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY!
  },
};

const AzureMapContent: React.FC = () => {
  return (
    <AzureMapsProvider>
      <AzureMap options={option}>
      </AzureMap>
    </AzureMapsProvider>
  );
};

export default AzureMapContent;