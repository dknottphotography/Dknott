import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'intro', title: 'Intro Section'},
    {name: 'portfolio', title: 'Portfolio Section'},
    {name: 'testimonials', title: 'Testimonials Section'},
    {name: 'cta', title: 'Call to Action'},
  ],
  fields: [
    // ── Hero ─────────────────────────────────────────────
    defineField({
      group: 'hero',
      name: 'heroImage',
      title: 'Hero Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'hero',
      name: 'heroSubtitle',
      title: 'Hero Subtitle (italic line)',
      type: 'string',
      description: 'e.g. for the',
    }),
    defineField({
      group: 'hero',
      name: 'heroTitle',
      title: 'Hero Title (big line)',
      type: 'string',
      description: 'e.g. LOVED',
    }),
    defineField({
      group: 'hero',
      name: 'heroEyebrow',
      title: 'Hero Description',
      type: 'text',
      rows: 2,
      description: 'e.g. For couples who believe the best moments are the ones that happen naturally.',
    }),

    // ── Intro ────────────────────────────────────────────
    defineField({
      group: 'intro',
      name: 'introBody',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 4,
      description: 'The lede paragraph under the hero ("We take the time to truly understand you...").',
    }),

    // ── Portfolio strip ──────────────────────────────────
    defineField({
      group: 'portfolio',
      name: 'portfolioHeading',
      title: 'Portfolio Section Heading',
      type: 'string',
      description: 'e.g. Real wedding Blogs',
      initialValue: "Real wedding Blog's",
    }),

    // ── Testimonials ─────────────────────────────────────
    defineField({
      group: 'testimonials',
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description: 'Rotating client testimonials. Leave empty to use the built-in ones.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'author', title: 'Couple Name', type: 'string'}),
            defineField({name: 'text', title: 'Testimonial (HTML allowed)', type: 'text', rows: 6}),
            defineField({name: 'image', title: 'Background Photo', type: 'cloudinary.asset'}),
          ],
        },
      ],
    }),

    // ── CTA / Celebrate section ──────────────────────────
    defineField({
      group: 'cta',
      name: 'ctaEyebrow',
      title: 'CTA Eyebrow',
      type: 'string',
      description: 'e.g. AS SEEN ON THE COVER OF WEDDING MAGAZINE',
    }),
    defineField({
      group: 'cta',
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'e.g. Celebrating Your Love!',
    }),
    defineField({
      group: 'cta',
      name: 'ctaBody',
      title: 'CTA Body',
      type: 'text',
      rows: 5,
    }),
    defineField({
      group: 'cta',
      name: 'ctaImage',
      title: 'CTA Photo',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'cta',
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      initialValue: 'Enquire about your date',
    }),
    defineField({
      group: 'cta',
      name: 'ctaHref',
      title: 'CTA Button Link',
      type: 'string',
      initialValue: '/contact',
    }),
    defineField({
      name: 'heroSignoff',
      title: 'Hero Sign-off Line',
      type: 'string',
      group: 'hero',
      description: 'Italic sign-off at the bottom of the hero, e.g. "Truly yours".',
      initialValue: 'Truly yours',
    }),
    defineField({
      name: 'heroTags',
      title: 'Hero Style Tags',
      type: 'string',
      group: 'hero',
      description: 'Small caps line under the sign-off, e.g. "CINEMATIC, VISUAL POETRY, STORY TELLING, ROMANTIC".',
      initialValue: 'CINEMATIC, VISUAL POETRY, STORY TELLING, ROMANTIC',
    }),
    defineField({
      name: 'viewGalleryLabel',
      title: 'View Gallery Button Label',
      type: 'string',
      group: 'portfolio',
      description: 'Button under the portfolio strip.',
      initialValue: 'View Gallery',
    }),
    defineField({
      name: 'loadingWeddingsText',
      title: 'Loading Text',
      type: 'string',
      group: 'portfolio',
      description: 'Shown while the portfolio loads.',
      initialValue: 'Loading beautiful weddings...',
    }),
    defineField({
      name: 'testimonialsLabel',
      title: 'Testimonials Heading',
      type: 'string',
      group: 'testimonials',
      description: 'Small heading above the rotating quotes.',
      initialValue: 'What our couples say',
    }),
    defineField({
      name: 'contactUsHeading',
      title: 'Contact Heading',
      type: 'string',
      group: 'cta',
      description: 'e.g. CONTACT US',
      initialValue: 'CONTACT US',
    }),
    defineField({
      name: 'bookDateLabel',
      title: 'Book Button Label',
      type: 'string',
      group: 'cta',
      description: 'e.g. BOOK YOUR DATE',
      initialValue: 'BOOK YOUR DATE',
    }),
  ],
})
