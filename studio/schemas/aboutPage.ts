import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  fields: [
    // ── Hero ───────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image (full-screen architectural/cinematic)',
      type: 'cloudinary.asset',
    }),

    // ── About Section ──────────────────────────────
    defineField({
      name: 'aboutTitle',
      title: 'About Section Title',
      type: 'string',
      initialValue: 'ABOUT US',
    }),
    defineField({
      name: 'aboutSubtitle',
      title: 'About Subtitle / Tagline',
      type: 'string',
      initialValue: 'PHOTOGRAPHY BY DKNOTT',
    }),
    defineField({
      name: 'aboutPhoto',
      title: 'About Section Photo',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About Body Text',
      description: 'Main story text. Use blank lines for paragraph breaks.',
      type: 'text',
      rows: 8,
    }),

    // ── Tagline Banner ─────────────────────────────
    defineField({
      name: 'tagline',
      title: 'Tagline / Quote Banner Text',
      type: 'text',
      rows: 2,
      initialValue: 'Experience the magic of your love story\nthrough our lens!',
    }),

    // ── Blogs / Photo Strip ────────────────────────
    defineField({
      name: 'blogStripImage1',
      title: 'Blogs Strip — Photo 1 (Left)',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'blogStripLink1',
      title: 'Blogs Strip — Photo 1 Link (e.g. /real_weddings?open=reshma-prakash)',
      type: 'string',
      initialValue: '/real_weddings?open=reshma-prakash',
    }),
    defineField({
      name: 'blogStripImage2',
      title: 'Blogs Strip — Photo 2 (Center)',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'blogStripImage3',
      title: 'Blogs Strip — Photo 3 (Right)',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'featuredBlogImage',
      title: 'Featured Blog Card — Portrait Photo',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'featuredBlogLink',
      title: 'Featured Blog Link URL',
      type: 'string',
      initialValue: '/real_weddings',
    }),

    // ── Panoramic Walk Photo ───────────────────────
    defineField({
      name: 'panoramicImage',
      title: 'Panoramic Transition Photo (Couple holding hands in meadow/golden light)',
      type: 'cloudinary.asset',
    }),

    // ── Love Notes ─────────────────────────────────
    defineField({
      name: 'loveNotes',
      title: 'Love Notes (Testimonials)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'couple',  title: 'Couple Name',  type: 'string' }),
            defineField({ name: 'quote',   title: 'Quote',        type: 'text', rows: 4 }),
            defineField({ name: 'photo',   title: 'Couple Photo (Square 1:1 recommended)', type: 'cloudinary.asset' }),
          ],
        },
      ],
    }),

    // ── Films Section ──────────────────────────────
    defineField({
      name: 'filmThumbnail',
      title: 'Films Section — Video Thumbnail Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'filmUrl',
      title: 'Films Section — Video URL (YouTube / Vimeo / Route)',
      type: 'string',
      initialValue: '/wedding_films',
    }),
    defineField({
      name: 'weddingFilms',
      title: 'Wedding Films Carousel',
      type: 'array',
      description: 'Films shown in the auto-rotating films carousel. Leave empty to use the built-in list.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Couple Name', type: 'string'}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
            defineField({
              name: 'videoId',
              title: 'YouTube Video ID',
              type: 'string',
              description: 'The 11-character ID from the YouTube URL.',
            }),
            defineField({name: 'thumbnail', title: 'Thumbnail Image', type: 'cloudinary.asset'}),
          ],
        },
      ],
    }),

    // ── Showcase & Blog Strips ───────────────────────
    defineField({
      name: 'showcaseImages',
      title: 'Showcase Photo Strip',
      type: 'array',
      description: 'Photos in the scrolling showcase strip. Leave empty to use the built-in photos.',
      of: [{type: 'cloudinary.asset'}],
    }),
    defineField({
      name: 'blogImages',
      title: 'Blog Photo Strip',
      type: 'array',
      description: 'Photos in the blog slider strip. Leave empty to use the built-in photos.',
      of: [{type: 'cloudinary.asset'}],
    }),
  ],
})
