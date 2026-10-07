import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'e.g. Tell us about your day.',
      initialValue: 'Tell us about your day.',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'formHeading',
      title: 'Inquiry Form Heading',
      type: 'string',
      initialValue: 'Send an Inquiry',
    }),
    defineField({
      name: 'directHeading',
      title: '"Reach Us Directly" Heading',
      type: 'string',
      initialValue: 'Reach us directly',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Shown in the "reach us directly" block. Falls back to Site Settings.',
    }),
    defineField({
      name: 'phone',
      title: 'Contact Phone',
      type: 'string',
      description: 'Falls back to Site Settings.',
    }),
    defineField({
      name: 'address',
      title: 'Studio Address',
      type: 'string',
      description: 'Falls back to Site Settings.',
    }),
  ],
})
