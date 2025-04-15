import { z } from 'zod'

const iconSchema = z.object({
  id: z.string().optional(),
  created_at: z.string().optional(),
  prefix: z.string(),
  suffix: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  classifications: z.array(z.string()).optional(),
  tip: z
    .object({
      id: z.string(),
      created_at: z.string(),
      text: z.string(),
      url: z.string(),
      lang: z.string(),
      agree_count: z.number(),
      disagree_count: z.number(),
    })
    .optional(),
})

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  short_name: z.string().optional(),
  plural_name: z.string().optional(),
  icon: iconSchema,
})

const photoSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  prefix: z.string(),
  suffix: z.string(),
  width: z.number(),
  height: z.number(),
  classifications: z.array(z.string()).optional(),
  tip: z
    .object({
      id: z.string(),
      created_at: z.string(),
      text: z.string(),
      url: z.string(),
      lang: z.string(),
      agree_count: z.number(),
      disagree_count: z.number(),
    })
    .optional(),
})

const geocodeSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const fsqPlaceSchema = z.object({
  fsq_id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  distance: z.number().optional(),
  popularity: z.number().optional(),
  price: z.number().min(1).max(4).optional(),
  rating: z.number().min(0).max(10).optional(),
  verified: z.boolean().optional(),
  website: z.string().url().optional(),
  email: z.string().optional(),
  tel: z.string().optional(),
  fax: z.string().optional(),
  link: z.string().url().optional(),
  store_id: z.string().optional(),
  date_closed: z.string().optional(),
  closed_bucket: z.string().optional(),
  venue_reality_bucket: z.string().optional(),
  timezone: z.string().optional(),
  tastes: z.array(z.string()).optional(),

  location: z.object({
    address: z.string().optional(),
    address_extended: z.string().optional(),
    locality: z.string().optional(),
    dma: z.string().optional(),
    region: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
    admin_region: z.string().optional(),
    post_town: z.string().optional(),
    po_box: z.string().optional(),
    cross_street: z.string().optional(),
    formatted_address: z.string().optional(),
    census_block: z.string().nullable().optional(),
    neighborhood: z.array(z.string()).optional(),
  }),

  categories: z.array(categorySchema),

  chains: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),

  photos: z.array(photoSchema).optional(),

  hours: z
    .object({
      display: z.string().optional(),
      is_local_holiday: z.boolean().optional(),
      open_now: z.boolean().optional(),
      regular: z
        .array(
          z.object({
            day: z.number(),
            open: z.string(),
            close: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),

  hours_popular: z
    .array(
      z.object({
        day: z.number(),
        open: z.string(),
        close: z.string(),
      }),
    )
    .optional(),

  geocodes: z
    .object({
      main: geocodeSchema.optional(),
      roof: geocodeSchema.optional(),
      front_door: geocodeSchema.optional(),
      road: geocodeSchema.optional(),
      drop_off: geocodeSchema.optional(),
    })
    .optional(),

  social_media: z
    .object({
      facebook_id: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),

  stats: z
    .object({
      total_photos: z.number(),
      total_ratings: z.number(),
      total_tips: z.number(),
    })
    .optional(),

  menu: z.string().optional(),

  tips: z
    .array(
      z.object({
        id: z.string(),
        created_at: z.string(),
        text: z.string(),
        url: z.string(),
        lang: z.string(),
        agree_count: z.number(),
        disagree_count: z.number(),
      }),
    )
    .optional(),

  features: z
    .object({
      payment: z
        .object({
          credit_cards: z.object({
            accepts_credit_cards: z.any().optional(),
            amex: z.any().optional(),
            discover: z.any().optional(),
            visa: z.any().optional(),
            diners_club: z.any().optional(),
            master_card: z.any().optional(),
            union_pay: z.any().optional(),
          }),
          digital_wallet: z.object({
            accepts_nfc: z.any().optional(),
          }),
        })
        .optional(),

      food_and_drink: z
        .object({
          alcohol: z
            .object({
              bar_service: z.any().optional(),
              beer: z.any().optional(),
              byo: z.any().optional(),
              cocktails: z.any().optional(),
              full_bar: z.any().optional(),
              wine: z.any().optional(),
            })
            .optional(),

          meals: z
            .object({
              bar_snacks: z.any().optional(),
              breakfast: z.any().optional(),
              brunch: z.any().optional(),
              lunch: z.any().optional(),
              happy_hour: z.any().optional(),
              dessert: z.any().optional(),
              dinner: z.any().optional(),
              tasting_menu: z.any().optional(),
            })
            .optional(),
        })
        .optional(),

      services: z
        .object({
          delivery: z.any().optional(),
          takeout: z.any().optional(),
          drive_through: z.any().optional(),
          dine_in: z
            .object({
              reservations: z.any().optional(),
              online_reservations: z.any().optional(),
              groups_only_reservations: z.any().optional(),
              essential_reservations: z.any().optional(),
            })
            .optional(),
        })
        .optional(),

      amenities: z
        .object({
          restroom: z.any().optional(),
          smoking: z.any().optional(),
          jukebox: z.any().optional(),
          music: z.any().optional(),
          live_music: z.any().optional(),
          private_room: z.any().optional(),
          outdoor_seating: z.any().optional(),
          tvs: z.any().optional(),
          atm: z.any().optional(),
          coat_check: z.any().optional(),
          wheelchair_accessible: z.any().optional(),
          sit_down_dining: z.any().optional(),
          wifi: z.string().optional(),
          parking: z
            .object({
              parking: z.any().optional(),
              street_parking: z.any().optional(),
              valet_parking: z.any().optional(),
              public_lot: z.any().optional(),
              private_lot: z.any().optional(),
            })
            .optional(),
        })
        .optional(),

      attributes: z.record(z.string()).optional(),
    })
    .optional(),
})

export const fsqApiResponseSchema = z.object({
  results: z.array(fsqPlaceSchema),
  context: z.object({
    geo_bounds: z.object({
      circle: z.object({
        center: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        radius: z.number(),
      }),
    }),
  }),
})

export type FsqPlaceResponse = z.infer<typeof fsqPlaceSchema>
export type FsqApiResponse = z.infer<typeof fsqApiResponseSchema>
export type RestaurantCategory = z.infer<typeof categorySchema>
