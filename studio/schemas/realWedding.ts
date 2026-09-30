import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'realWedding',
  title: 'Real Wedding',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. John & Jane',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Destination', value: 'Destination'},
          {title: 'Traditional', value: 'Traditional'},
          {title: 'Intimate', value: 'Intimate'},
        ],
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{type: 'cloudinary.asset'}],
    }),
  ],
})

