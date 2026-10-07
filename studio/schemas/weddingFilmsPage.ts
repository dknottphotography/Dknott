import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'weddingFilmsPage',
  title: 'Wedding Films Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      initialValue: 'Wedding Films',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Wedding Films',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'string',
      initialValue: 'Films that sound like your wedding',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'cloudinary.asset',
      description: 'Autoplaying muted hero video. Falls back to the built-in reel.',
    }),
    defineField({
      name: 'films',
      title: 'Films',
      type: 'array',
      description: 'Leave empty to use the built-in film list.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'couple', title: 'Couple Name', type: 'string'}),
            defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
            defineField({
              name: 'videoId',
              title: 'YouTube Video ID',
              type: 'string',
              description: 'The 11-character ID from the YouTube URL, e.g. Yv0VLdyL48A',
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  {title: 'Wedding', value: 'wedding'},
                  {title: 'Teaser', value: 'teaser'},
                  {title: 'Invitation', value: 'invitation'},
                ],
              },
              initialValue: 'wedding',
            }),
          ],
        },
      ],
    }),
  ],
})
