import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'universePage',
  title: 'Universe Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. UNREHEARSED',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      description: 'e.g. Street, Nature, Portrait',
    }),
  ],
})

