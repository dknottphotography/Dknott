import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'clientGuidePage',
  title: 'Client Guide Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'faq', title: 'FAQ Section'},
    {name: 'cta', title: 'Call to Action'},
  ],
  fields: [
    defineField({
      group: 'hero',
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      initialValue: 'Client Guide',
    }),
    defineField({
      group: 'hero',
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      initialValue: "Everything you'd normally ask us over coffee.",
    }),
    defineField({
      group: 'hero',
      name: 'heroImage',
      title: 'Hero Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      group: 'faq',
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description: 'Leave empty to use the built-in questions.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4}),
          ],
        },
      ],
    }),
    defineField({
      group: 'cta',
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      initialValue: 'Still have a question?',
    }),
    defineField({
      group: 'cta',
      name: 'ctaText',
      title: 'CTA Text',
      type: 'text',
      rows: 2,
      initialValue: "We'd rather answer it now than surprise you later — reach out any time.",
    }),
    defineField({
      group: 'cta',
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      initialValue: 'Ask us directly',
    }),
  ],
})
