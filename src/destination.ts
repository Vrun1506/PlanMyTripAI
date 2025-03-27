import axios from 'axios';
import { TravelDetails } from './components/ChatContext';

const headers = {
  'x-rapidapi-key': process.env.BOOKING_COM_KEY!,
  'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
}

export async function searchDestination(query: string) {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination',
    params: { query },
    headers
  };

  console.log("Searching with query: " + query)
  const response = await axios.request(options);
  // console.log(response);

  // Only get the first destination
  const destination = response.data.data[0];
  return { dest_id: destination.dest_id, dest_type: destination.dest_type };
}

export async function searchHotels(destinations: { dest_id: string, dest_type: string }[], travelDetails: TravelDetails) {
  const params: { [key: string]: string } = {};

  const { travelDates, price, travelers, rooms } = travelDetails;
  const { startDate, endDate } = travelDates || {};

  if (destinations.length == 0) {
    return;
  }

  // Map travel dates
  params.arrival_date = startDate || '';
  params.departure_date = endDate || '';

  // Map price: convert numbers to strings
  params.price_min = price.min != null ? price.min.toString() : '';
  params.price_max = price.max != null ? price.max.toString() : '';

  // Map travelers
  params.adults = travelers.adults != null ? travelers.adults.toString() : '';

  // Map children_age (if children count is provided, generate a string with default value)
  if (travelers.children != null && travelers.children > 0) {
    params.children_age = '0,17';
  }

  // Map rooms
  params.room_qty = rooms != null ? rooms.toString() : '';

  // Additional fixed/default parameters
  params.page_number = '1';
  params.units = 'metric';
  params.temperature_unit = 'c';

  console.log("\n --- Params --- \n" + JSON.stringify(params));

  const searchRequest = async (dest_id: string, search_type: string) => {
    const options = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels',
      params: {
        dest_id,
        search_type,
        ...params
      },
      headers
    };

    const { data } = await axios.request(options);
    console.log("\n\n");
    console.log(data.data);
    console.log("\n\n")
    return data.data.hotels;
  }

  // Map destinations -> dest_id and search_type
  const responses = await Promise.all(destinations.map(dest => searchRequest(dest.dest_id, dest.dest_type)));
  console.log("Number of responses for hotel selections: " + responses.length);
  const hotels = responses.map((response) => response[0]);
  console.log(responses);

  return hotels;
}