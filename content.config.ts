import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

const createButtonSchema = () => z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

const createAuthorSchema = () => z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  twitter: z.string().optional(),
  to: z.string().optional(),
  avatar: createImageSchema().optional()
})

const createTestimonialSchema = () => z.object({
  quote: z.string(),
  author: createAuthorSchema()
})

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
        hero: createBaseSchema().extend({
          headline: z.string().optional(),
          links: z.array(createButtonSchema()),
          images: z.array(createImageSchema())
        }),
        howItWorks: createBaseSchema().extend({
          // Cut-out photo of a person (transparent background), shown in front of a blob
          image: createImageSchema().optional(),
          steps: z.array(z.object({
            icon: z.string().editor({ input: 'icon' }),
            title: z.string(),
            description: z.string()
          }))
        }),
        teachers: createBaseSchema().extend({
          items: z.array(z.object({
            name: z.string(),
            subject: z.string(),
            bio: z.string(),
            rating: z.number(),
            reviews: z.number(),
            price: z.string(),
            avatar: createImageSchema(),
            // Cut-out photo (transparent background) shown on a blob in the teacher's card
            photo: createImageSchema().optional()
          }))
        }),
        testimonials: createBaseSchema().extend({
          items: z.array(createTestimonialSchema())
        }),
        faq: createBaseSchema().extend({
          categories: z.array(
            z.object({
              title: z.string().nonempty(),
              questions: z.array(
                z.object({
                  label: z.string().nonempty(),
                  content: z.string().nonempty()
                })
              )
            }))
        }),
        cta: createBaseSchema().extend({
          links: z.array(createButtonSchema())
        })
      })
    }),
    subjects: defineCollection({
      type: 'data',
      source: 'subjects/*.yml',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        icon: z.string().editor({ input: 'icon' }),
        image: createImageSchema(),
        topics: z.array(z.string()),
        order: z.number()
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        minRead: z.number(),
        date: z.date(),
        image: z.string().nonempty().editor({ input: 'media' }),
        author: createAuthorSchema()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: [
        { include: 'subjects.yml' },
        { include: 'blog.yml' }
      ],
      schema: z.object({
        links: z.array(createButtonSchema())
      })
    }),
    events: defineCollection({
      type: 'page',
      source: 'events.yml',
      schema: z.object({
        links: z.array(createButtonSchema()),
        events: z.array(z.object({
          category: z.enum(['Webinar', 'Workshop', 'Podcast']),
          title: z.string(),
          description: z.string().optional(),
          date: z.date(),
          location: z.string(),
          url: z.string().optional()
        }))
      })
    }),
    about: defineCollection({
      type: 'page',
      source: 'about.yml',
      schema: z.object({
        content: z.object({}),
        stats: z.array(z.object({
          value: z.string(),
          label: z.string()
        })),
        values: z.array(z.object({
          icon: z.string().editor({ input: 'icon' }),
          title: z.string(),
          description: z.string()
        })),
        images: z.array(createImageSchema())
      })
    })
  }
})
