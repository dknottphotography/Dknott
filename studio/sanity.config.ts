import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {cloudinarySchemaPlugin} from 'sanity-plugin-cloudinary'
import {schemaTypes} from './schemas'

const SINGLETONS = ['siteSettings', 'homePage', 'contactPage', 'universePage', 'ourStoryPage', 'aboutPage']

export default defineConfig({
  name: 'default',
  title: 'DKNOTT PHOTOGRAPHY',

  projectId: 'cqd974oj',
  dataset: 'production',

  plugins: [
    cloudinarySchemaPlugin(),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Home Page')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('Our Story Page')
              .child(S.document().schemaType('ourStoryPage').documentId('ourStoryPage')),
            S.listItem()
              .title('About Us Page')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Contact Page')
              .child(S.document().schemaType('contactPage').documentId('contactPage')),
            S.listItem()
              .title('Universe Page')
              .child(S.document().schemaType('universePage').documentId('universePage')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !SINGLETONS.includes(listItem.getId() as string)
            )
          ])
    })
  ],

  schema: {
    types: schemaTypes,
  },
})

