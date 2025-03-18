import { getGenerativeResponse } from '@/chat';
import { NextResponse } from 'next/server';
import { blankTravelDetails, TravelDetails } from '@/components/ChatContext';

export async function POST(req: Request) {
  const { message, travelDetails } = await req.json() as { message: string, travelDetails: TravelDetails };

  const response = await getGenerativeResponse(`
    The user has provided the following message:
    
    ${message}


    The user also has the current travel plan:

    ${JSON.stringify({ ...blankTravelDetails, ...travelDetails })}


    Sitcking to the JSON schema, modify the travel plan to match the user's request. Respond in JSON only. 
    `.trim()
  );

  const regex = /[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis;
  const matches = response.match(regex);

  // Get the new details from the response (filter out plaintext around the JSON)
  const newTravelDetails = JSON.parse(matches![0]);;

  return NextResponse.json({ newTravelDetails, reply: "Okay, I've updated your travel plan." });
}