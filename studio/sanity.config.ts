import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool, defineLocations} from 'sanity/presentation'
import {cloudinarySchemaPlugin} from 'sanity-plugin-cloudinary'
import {schemaTypes} from './schemas'

const SINGLETONS = ['siteSettings', 'homePage', 'contactPage', 'universePage', 'ourStoryPage', 'aboutPage', 'weddingFilmsPage', 'clientGuidePage', 'realWeddingsPage', 'linkTreePage']

/**
 * Where a page's content shows on the live website. Used by the Preview
 * (Presentation) tool: opening a document can jump straight to the page
 * it controls, and the site preview knows which document it is showing.
 * Hrefs must match the routes in src/App.jsx.
 */
const pageLocation = (href: string, title: string) =>
  defineLocations({
    locations: [{title, href}],
    message: 'Editing this document changes the page it controls on the website.',
    tone: 'positive',
  })

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
    }),
    presentationTool({
      // Live website previewed inside the Studio. Opening it with
      // ?sanity-preview=1 puts the site into draft-preview mode: it loads
      // unpublished (draft) content and shows click-to-edit overlays, so
      // edits can be checked on the real site before publishing.
      previewUrl: {
        initial: 'https://dknottphotography.in',
        previewMode: {
          enable: '/?sanity-preview=1',
        },
      },
      resolve: {
        locations: {
          siteSettings: pageLocation('/', 'Site Settings (whole website)'),
          homePage: pageLocation('/home', 'Home Page'),
          aboutPage: pageLocation('/', 'About Us (opens as the home page)'),
          ourStoryPage: pageLocation('/our_story', 'Our Story Page'),
          contactPage: pageLocation('/contact', 'Contact Page'),
          universePage: pageLocation('/universe', 'Universe Page'),
          weddingFilmsPage: pageLocation('/wedding_films', 'Wedding Films Page'),
          clientGuidePage: pageLocation('/client_guide', 'Client Guide Page'),
          realWeddingsPage: pageLocation('/real_weddings', 'Real Weddings Page'),
          linkTreePage: pageLocation('/index', 'Link Tree Page'),
        },
      },
    })
  ],

  schema: {
    types: schemaTypes,
  },
})
