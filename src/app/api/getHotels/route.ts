import { TravelDetails } from '@/components/ChatContext';
import { searchDestination, searchHotels } from '@/destination';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const params = await req.json();
  const travelDetails: TravelDetails = params.travelDetails;

  const promises = travelDetails.cities!.map(city => searchDestination(city));
  const destinations = await Promise.all(promises);
  console.log(" --- Destinations --- \n");
  destinations.map((destination, index) => console.log(`City: ${travelDetails.cities![index]}, Id: ${destination.dest_id}, Type: ${destination.dest_type}`))
  const hotels = await searchHotels(destinations, travelDetails);

  try {
    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Error searching hotels:', error);
    return NextResponse.json({ error: 'Error searching hotels' }, { status: 500 });
  }
}
