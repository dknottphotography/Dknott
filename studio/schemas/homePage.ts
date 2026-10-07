import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // ── Hero ─────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle (italic line)',
      type: 'string',
      description: 'e.g. for the',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title (big line)',
      type: 'string',
      description: 'e.g. LOVED',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Description',
      type: 'text',
      rows: 2,
      description: 'e.g. For couples who believe the best moments are the ones that happen naturally.',
    }),

    // ── Intro ────────────────────────────────────────────
    defineField({
      name: 'introBody',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 4,
      description: 'The lede paragraph under the hero ("We take the time to truly understand you...").',
    }),

    // ── Portfolio strip ──────────────────────────────────
    defineField({
      name: 'portfolioHeading',
      title: 'Portfolio Section Heading',
      type: 'string',
      description: 'e.g. Real wedding Blogs',
      initialValue: "Real wedding Blog's",
    }),

    // ── Testimonials ─────────────────────────────────────
    defineField({
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
      name: 'ctaEyebrow',
      title: 'CTA Eyebrow',
      type: 'string',
      description: 'e.g. AS SEEN ON THE COVER OF WEDDING MAGAZINE',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      description: 'e.g. Celebrating Your Love!',
    }),
    defineField({
      name: 'ctaBody',
      title: 'CTA Body',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'ctaImage',
      title: 'CTA Photo',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      initialValue: 'Enquire about your date',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA Button Link',
      type: 'string',
      initialValue: '/contact',
    }),
  ],
})
