import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ourStoryPage',
  title: 'Our Story Page',
  type: 'document',
  fields: [
    // ── Hero ───────────────────────────────────────────────
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow Label',
      type: 'string',
      initialValue: 'Our Story',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Two people who couldn\'t stop photographing weddings.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'cloudinary.asset',
    }),

    // ── How We Started ─────────────────────────────────────
    defineField({
      name: 'startEyebrow',
      title: '"How We Started" Eyebrow',
      type: 'string',
      initialValue: 'How We Started',
    }),
    defineField({
      name: 'startHeading',
      title: '"How We Started" Heading',
      type: 'string',
      initialValue: 'It began as a favour for a friend.',
    }),
    defineField({
      name: 'startBody',
      title: '"How We Started" Body (first paragraph)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'startBody2',
      title: '"How We Started" Body (second paragraph)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'startImage',
      title: '"How We Started" Photo',
      type: 'cloudinary.asset',
    }),

    // ── Values ─────────────────────────────────────────────
    defineField({
      name: 'valuesEyebrow',
      title: 'Values Section Eyebrow',
      type: 'string',
      initialValue: 'What We Believe',
    }),
    defineField({
      name: 'valuesHeading',
      title: 'Values Section Heading',
      type: 'string',
      initialValue: 'Three things we won\'t compromise on',
    }),
    defineField({
      name: 'values',
      title: 'Values Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),

    // ── Process Steps ──────────────────────────────────────
    defineField({
      name: 'processEyebrow',
      title: 'Process Section Eyebrow',
      type: 'string',
      initialValue: 'The Process',
    }),
    defineField({
      name: 'processHeading',
      title: 'Process Section Heading',
      type: 'string',
      initialValue: 'From "hello" to your gallery landing in your inbox',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label (e.g. "01 · Inquire")', type: 'string' }),
            defineField({ name: 'body', title: 'Description', type: 'text', rows: 2 }),
          ],
        },
      ],
    }),

    // ── Love Notes / Testimonials ──────────────────────────
    defineField({
      name: 'loveNotesHeading',
      title: 'Love Notes Section Heading',
      type: 'string',
      initialValue: 'Love notes',
    }),
    defineField({
      name: 'loveNotes',
      title: 'Love Notes (Testimonials)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'couple', title: 'Couple Name', type: 'string' }),
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
            defineField({ name: 'photo', title: 'Couple Photo', type: 'cloudinary.asset' }),
          ],
        },
      ],
    }),

    // ── CTA ────────────────────────────────────────────────
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      initialValue: 'Ready to talk dates?',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      initialValue: 'Get in touch',
    }),

    // ── Instagram Section ──────────────────────────────────
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle (display text)',
      type: 'string',
      initialValue: '@dknottphotography',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      initialValue: 'https://instagram.com/dknottphotography',
    }),
  ],
})
