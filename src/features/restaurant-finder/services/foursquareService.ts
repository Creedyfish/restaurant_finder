import fsqDevelopers from "@api/fsq-developers";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export const searchRestaurants = async (params: URLSearchParams) => {
  fsqDevelopers.auth(FOURSQUARE_API_KEY!);
  const response = await fsqDevelopers.placeSearch({
    query: params.get("query") ?? undefined,
    fields: "hours%2Crating%2Cprice%2Cname%2Clocation%2Ccategories",
    near: params.get("near") ?? undefined,
    limit: 2,
  });

  return response;
};
