import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'linkTreePage',
  title: 'Link Tree Page',
  type: 'document',
  description: 'The "/" landing page with photo strip, logo and link buttons.',
  groups: [
    {name: 'strip', title: 'Photo Strip'},
    {name: 'profile', title: 'Profile'},
    {name: 'links', title: 'Link Buttons'},
  ],
  fields: [
    defineField({
      name: 'stripImages',
      title: 'Photo Strip Images',
      type: 'array',
      group: 'strip',
      description: 'The clickable photo strip at the top. Add up to 8 images.',
      of: [{type: 'cloudinary.asset'}],
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline Under Name',
      type: 'text',
      rows: 2,
      group: 'profile',
      description: 'e.g. DOCUMENTARY WEDDING PHOTOGRAPHY & FILMS. 350+ WEDDINGS ACROSS INDIA & ABROAD.',
    }),
    defineField({
      name: 'links',
      title: 'Link Buttons',
      type: 'array',
      group: 'links',
      description: 'The pill buttons. Leave empty to use the built-in list.',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'label', title: 'Button Label', type: 'string'}),
          defineField({name: 'href', title: 'Link URL', type: 'string', description: 'e.g. /about or https://…'}),
        ],
      }],
    }),
  ],
})
