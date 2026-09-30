import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
    }),
    defineField({
      name: 'creamColor',
      title: 'Cream Background Color',
      type: 'string',
      description: 'Hex code for the primary background (e.g. #F8F3E9)',
    }),
  ],
})

