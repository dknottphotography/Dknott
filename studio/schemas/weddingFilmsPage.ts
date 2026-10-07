import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'weddingFilmsPage',
  title: 'Wedding Films Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'films', title: 'Films Gallery'},
  ],
  fields: [
    defineField({
      group: 'hero',
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      initialValue: 'Wedding Films',
    }),
    defineField({
      group: 'hero',
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Wedding Films',
    }),
    defineField({
      group: 'hero',
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'string',
      initialValue: 'Films that sound like your wedding',
    }),
    defineField({
      group: 'hero',
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'cloudinary.asset',
      description: 'Autoplaying muted hero video. Falls back to the built-in reel.',
    }),
    defineField({
      group: 'films',
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
    defineField({
      name: 'filterAllLabel',
      title: 'Filter: All Label',
      type: 'string',
      group: 'films',
      initialValue: 'All Films',
    }),
    defineField({
      name: 'filterWeddingsLabel',
      title: 'Filter: Weddings Label',
      type: 'string',
      group: 'films',
      initialValue: 'Weddings',
    }),
    defineField({
      name: 'filterTeasersLabel',
      title: 'Filter: Teasers Label',
      type: 'string',
      group: 'films',
      initialValue: 'Teasers',
    }),
    defineField({
      name: 'filterInvitationsLabel',
      title: 'Filter: Invitations Label',
      type: 'string',
      group: 'films',
      initialValue: 'Invitations',
    }),
  ],
})
