import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'cloudinary.asset',
      description: 'The large image behind the navigation on the home page.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'e.g. for the',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'e.g. LOVED',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Description',
      type: 'text',
      description: 'e.g. For couples who believe the best moments...',
    }),
  ],
})

