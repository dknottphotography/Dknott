import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {cloudinarySchemaPlugin} from 'sanity-plugin-cloudinary'
import {schemaTypes} from './schemas'

const SINGLETONS = ['siteSettings', 'homePage', 'contactPage', 'universePage', 'ourStoryPage', 'aboutPage', 'weddingFilmsPage', 'clientGuidePage', 'realWeddingsPage', 'linkTreePage']

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
            S.listItem()
              .title('Wedding Films Page')
              .child(S.document().schemaType('weddingFilmsPage').documentId('weddingFilmsPage')),
            S.listItem()
              .title('Client Guide Page')
              .child(S.document().schemaType('clientGuidePage').documentId('clientGuidePage')),
            S.listItem()
              .title('Real Weddings Page')
              .child(S.document().schemaType('realWeddingsPage').documentId('realWeddingsPage')),
            S.listItem()
              .title('Link Tree Page')
              .child(S.document().schemaType('linkTreePage').documentId('linkTreePage')),
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

