import { UserMessage } from "@/features/restaurant-finder/schema/userMessage";

export const generateRestaurantSearchQuery = async (data: UserMessage) => {
  const response = await fetch("/api/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const responseData = await response.json();
  console.log(responseData);
  return responseData;
};
