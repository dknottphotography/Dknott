import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'universePage',
  title: 'Universe Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'e.g. Unrehearsed',
      initialValue: 'Unrehearsed',
    }),
    defineField({
      name: 'description',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'e.g. candid photography, still on the reel',
      initialValue: 'candid photography, still on the reel',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description:
        'Renames the Universe reels (Street / Nature / Portrait). The "id" must stay one of: street, nature, portrait — only change the display title. Leave the array empty to keep the built-in labels.',
      of: [
        defineField({
          name: 'category',
          title: 'Category',
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'Category ID',
              type: 'string',
              description: 'Must be street, nature or portrait.',
              options: {list: ['street', 'nature', 'portrait']},
            }),
            defineField({
              name: 'title',
              title: 'Display Title',
              type: 'string',
              description: 'e.g. Street',
            }),
          ],
        }),
      ],
    }),
  ],
})
