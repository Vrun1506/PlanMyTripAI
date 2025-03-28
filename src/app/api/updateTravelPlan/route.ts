import { getGenerativeResponseFromConversation } from '@/chat';
import { NextResponse } from 'next/server';
import { blankTravelDetails, TravelDetails } from '@/components/ChatContext';

export async function POST(req: Request) {
  const { messages, travelDetails } = await req.json() as { messages: string, travelDetails: TravelDetails };

  const response = await getGenerativeResponseFromConversation([...messages.slice(0, messages.length - 2), `
    The user has provided the following message:
    
    ${messages[messages.length - 1]}
    

    The user also has the current travel plan:

    ${JSON.stringify({ ...blankTravelDetails, ...travelDetails })}
   

    Sitcking to this JSON schema, modify the travel plan to match the user's request. Respond in JSON only.

    {
      // The user's travel details (null values represent unknowns)
      "travelDetails": {
        // Dates in YYYY-MM-DD format
        travelDates: {
          startDate: string | null;
          endDate: string | null;
          isFlexible: boolean | null;
        };

        // Budget in dollars
        price: {
          min: number | null;
          max: number | null;
        }

        // A list of cities for the trip
        cities: string[] | null

        // Average desired star rating
        accommodationStarRating: number | null;

        // Details of people on the trip
        travelers: {
          adults: number | null;
          children: number | null;
        };
        rooms: number | null;
      },
      "reply": string // A human friendly response to the user after changing their plan. Make sure to include a follow up for one of the missing details if they have any.
    }

    `.trim()]
  );

  const regex = /[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis;
  const matches = response.match(regex);

  // Get the new details from the response (filter out plaintext around the JSON)
  const { travelDetails: newTravelDetails, reply } = JSON.parse(matches![0]);;

  return NextResponse.json({ newTravelDetails, reply });
}