import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'about', title: 'About Section'},
    {name: 'tagline', title: 'Tagline Banner'},
    {name: 'blogs', title: 'Blogs Strip Section'},
    {name: 'lovenotes', title: 'Love Notes'},
    {name: 'films', title: 'Wedding Films Strip'},
  ],
  fields: [
    // ── Hero ───────────────────────────────────────
    defineField({
      group: 'hero',
      name: 'heroImage',
      title: 'Hero Background Image (full-screen architectural/cinematic)',
      type: 'cloudinary.asset',
    }),

    // ── About Section ──────────────────────────────
    defineField({
      group: 'about',
      name: 'aboutTitle',
      title: 'About Section Title',
      type: 'string',
      initialValue: 'ABOUT US',
    }),
    defineField({
      group: 'about',
      name: 'aboutSubtitle',
      title: 'About Subtitle / Tagline',
      type: 'string',
      initialValue: 'PHOTOGRAPHY BY DKNOTT',
    }),
    defineField({
      group: 'about',
      name: 'aboutPhoto',
      title: 'About Section Photo',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'about',
      name: 'aboutBody',
      title: 'About Body Text',
      description: 'Main story text. Use blank lines for paragraph breaks.',
      type: 'text',
      rows: 8,
    }),

    // ── Tagline Banner ─────────────────────────────
    defineField({
      group: 'tagline',
      name: 'tagline',
      title: 'Tagline / Quote Banner Text',
      type: 'text',
      rows: 2,
      initialValue: 'Experience the magic of your love story\nthrough our lens!',
    }),

    // ── Blogs / Photo Strip ────────────────────────
    defineField({
      group: 'blogs',
      name: 'blogStripImage1',
      title: 'Blogs Strip — Photo 1 (Left)',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'blogs',
      name: 'blogStripLink1',
      title: 'Blogs Strip — Photo 1 Link (e.g. /real_weddings?open=reshma-prakash)',
      type: 'string',
      initialValue: '/real_weddings?open=reshma-prakash',
    }),
    defineField({
      group: 'blogs',
      name: 'blogStripImage2',
      title: 'Blogs Strip — Photo 2 (Center)',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'blogs',
      name: 'blogStripImage3',
      title: 'Blogs Strip — Photo 3 (Right)',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'blogs',
      name: 'featuredBlogImage',
      title: 'Featured Blog Card — Portrait Photo',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'blogs',
      name: 'featuredBlogLink',
      title: 'Featured Blog Link URL',
      type: 'string',
      initialValue: '/real_weddings',
    }),

    // ── Panoramic Walk Photo ───────────────────────
    defineField({
      group: 'blogs',
      name: 'panoramicImage',
      title: 'Panoramic Transition Photo (Couple holding hands in meadow/golden light)',
      type: 'cloudinary.asset',
    }),

    // ── Love Notes ─────────────────────────────────
    defineField({
      group: 'lovenotes',
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
      group: 'films',
      name: 'filmThumbnail',
      title: 'Films Section — Video Thumbnail Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'films',
      name: 'filmUrl',
      title: 'Films Section — Video URL (YouTube / Vimeo / Route)',
      type: 'string',
      initialValue: '/wedding_films',
    }),
    defineField({
      group: 'films',
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
      group: 'blogs',
      name: 'showcaseImages',
      title: 'Showcase Photo Strip',
      type: 'array',
      description: 'Photos in the scrolling showcase strip. Leave empty to use the built-in photos.',
      of: [{type: 'cloudinary.asset'}],
    }),
    defineField({
      group: 'blogs',
      name: 'blogImages',
      title: 'Blog Photo Strip',
      type: 'array',
      description: 'Photos in the blog slider strip. Leave empty to use the built-in photos.',
      of: [{type: 'cloudinary.asset'}],
    }),
    defineField({
      name: 'blogsHeading',
      title: 'Blogs Heading',
      type: 'string',
      group: 'blogs',
      initialValue: 'BLOGS',
    }),
    defineField({
      name: 'blogImages',
      title: 'Featured Blog Slider Photos',
      type: 'array',
      group: 'blogs',
      description: 'Photos for the featured blog slider (slides one by one).',
      of: [{type: 'cloudinary.asset'}],
    }),
    defineField({
      name: 'viewPostLabel',
      title: 'View Post Link Label',
      type: 'string',
      group: 'blogs',
      initialValue: 'VIEW POST HERE',
    }),
    defineField({
      name: 'showcaseImages',
      title: 'Photo Showcase Carousel Images',
      type: 'array',
      group: 'blogs',
      description: 'Photos for the showcase carousel above the blogs heading.',
      of: [{type: 'cloudinary.asset'}],
    }),
    defineField({
      name: 'loveNotesHeading',
      title: 'Love Notes Heading',
      type: 'string',
      group: 'lovenotes',
      initialValue: 'LOVE NOTES',
    }),
    defineField({
      name: 'weddingFilms',
      title: 'Wedding Films Carousel',
      type: 'array',
      group: 'films',
      description: 'Films in the carousel. Thumbnail auto-uses the YouTube cover when empty.',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'videoId', title: 'YouTube Video ID', type: 'string', description: 'The 11-character ID from the YouTube link.'}),
          defineField({name: 'title', title: 'Film Title', type: 'string'}),
          defineField({name: 'subtitle', title: 'Film Subtitle', type: 'string'}),
          defineField({name: 'thumbnail', title: 'Custom Thumbnail (optional)', type: 'cloudinary.asset'}),
        ],
      }],
    }),
    defineField({
      name: 'filmsHeading',
      title: 'Films Heading',
      type: 'string',
      group: 'films',
      initialValue: 'WEDDING FILMS',
    }),
    defineField({
      name: 'filmsCtaLabel',
      title: 'Films Button Label',
      type: 'string',
      group: 'films',
      description: 'Button linking to the Wedding Films page.',
      initialValue: 'WEDDING FILMS',
    }),
  ],
})
