import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Star, Clock, DollarSign, ImageOff } from 'lucide-react'
import { FsqPlaceResponse, RestaurantCategory } from '../schema/fsqApiResponse'

export default function RestaurantCard({
  restaurant,
  keyword,
}: {
  restaurant: FsqPlaceResponse
  keyword: string
}) {
  const renderPriceLevel = (level: number) => {
    const dollars = []
    for (let i = 0; i < level; i++) {
      dollars.push(
        <DollarSign key={i} className="inline h-4 w-4 text-green-600" />,
      )
    }
    return dollars
  }

  const renderRating = (rating: number) => {
    // Convert 0-10 rating to 0-5 stars (dividing by 2)
    const starRating = rating / 2
    const stars = []
    const fullStars = Math.floor(starRating)
    const hasHalfStar = starRating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          className="inline h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      )
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="inline h-4 w-4 text-yellow-400" />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="inline h-4 w-4 text-gray-300" />,
      )
    }

    return (
      <div className="flex items-center justify-center">
        <div className="mr-2 flex items-center justify-center">{stars}</div>
        <span className="text-sm font-medium">{rating}/10</span>
      </div>
    )
  }
  const restaurantImage =
    restaurant?.photos?.[0]?.prefix && restaurant?.photos?.[0]?.suffix
      ? `${restaurant.photos[0].prefix}400x400${restaurant.photos[0].suffix}`
      : null

  return (
    <Card className="group w-full max-w-sm overflow-hidden shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        {restaurantImage ? (
          <Image
            src={restaurantImage}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200 text-gray-500">
            <ImageOff />
            No Image Found
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            className={`${restaurant.hours?.open_now ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {restaurant.hours?.open_now ? 'Open Now' : 'Closed'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              {restaurant.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              {restaurant.location.address}, {restaurant.location.locality}
            </CardDescription>
          </div>
          <Badge className="bg-blue-500 hover:bg-blue-600">
            {restaurant.categories.find(
              (category: RestaurantCategory) =>
                (category.short_name ?? '').toLowerCase() ===
                keyword.toLowerCase(),
            )?.short_name ||
              restaurant.categories[0]?.short_name ||
              ''}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col justify-center gap-1">
            <p className="text-sm font-semibold text-gray-500">Rating</p>
            {restaurant.rating ? renderRating(restaurant.rating) : 'N/A'}
          </div>
          <div className="flex flex-col justify-center gap-1">
            <p className="text-sm font-semibold text-gray-500">Price Level</p>
            <div>
              {restaurant.price !== undefined
                ? renderPriceLevel(restaurant.price)
                : 'N/A'}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-center border-t pt-4">
        <Clock className="mr-2 h-4 w-4 text-gray-500" />
        <div className="flex flex-col justify-center text-sm text-gray-700">
          {restaurant.hours?.display ? (
            restaurant.hours.display.split(';').map((dayHours, index) => (
              <p key={index} className="mb-1">
                {dayHours.trim()}
              </p>
            ))
          ) : (
            <p>Hours not available</p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
