"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserMessage,
  UserMessageSchema,
} from "@/features/restaurant-finder/schema/userMessage";
import { generateRestaurantSearchQuery } from "@/features/restaurant-finder/lib/generateRestaurantSearchQuery";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserMessage>({
    resolver: zodResolver(UserMessageSchema),
  });

  const onSubmit = (data: UserMessage) => {
    generateRestaurantSearchQuery(data);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <input type="text" {...register("query")} className="bg-slate-500" />
        <button type="submit" className="bg-green-400">
          Submit
        </button>
      </form>
    </div>
  );
}
