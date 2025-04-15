'use client'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  UserMessage,
  UserMessageSchema,
} from '@/features/restaurant-finder/schema/userMessage'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import RestaurantCard from '@/features/restaurant-finder/components/RestaurantCard'
import { Input } from '@/components/ui/input'
import { useInfiniteSearchQuery } from '@/features/restaurant-finder/hooks/useInfiniteRestaurantSearch'
import { FsqPlaceResponse } from '@/features/restaurant-finder/schema/fsqApiResponse'
import { Search, Loader2 } from 'lucide-react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<UserMessage | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserMessage>({
    resolver: zodResolver(UserMessageSchema),
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteSearchQuery(searchQuery)

  const onSubmit = (formData: UserMessage) => {
    setSearchQuery(formData)
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col gap-8 px-4 py-8 md:px-8 lg:px-12">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Restaurant Finder</h1>
          <ThemeToggle />
        </div>
        <p className="text-muted-foreground">
          Find the best restaurants near you
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card mx-auto w-full max-w-2xl rounded-lg border p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for restaurants, cuisine, or location..."
              className="pl-10"
              {...register('query')}
            />
          </div>
          <Button
            type="submit"
            className="md:w-auto"
            disabled={isFetching && !isFetchingNextPage}
          >
            {isFetching && !isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>
        {errors.query && (
          <div className="text-destructive mt-2 text-sm font-medium">
            {errors.query.message}
          </div>
        )}
      </form>

      {data && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {data.pages[0]?.results.length > 0
                ? `Results for "${data.pages[0]?.params.parameters.query}"`
                : `No restaurants found for "${data.pages[0]?.params.parameters.query}"`}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.pages.map((page, pageIndex) => (
              <Fragment key={`page-${pageIndex}`}>
                {page?.results?.map(
                  (restaurant: FsqPlaceResponse, index: number) => (
                    <RestaurantCard
                      key={
                        restaurant.fsq_id || `restaurant-${pageIndex}-${index}`
                      }
                      keyword={data.pages[0]?.params.parameters.query}
                      restaurant={restaurant}
                    />
                  ),
                )}
              </Fragment>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-8"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading more...
                  </>
                ) : (
                  'Load More Restaurants'
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {isFetching && !data && (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">
            Searching for restaurants...
          </span>
        </div>
      )}
    </div>
  )
}
