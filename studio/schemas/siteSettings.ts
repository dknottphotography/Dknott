import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Global brand settings applied across the whole website.',
  groups: [
    {name: 'brand', title: 'Brand'},
    {name: 'colors', title: 'Colors & Fonts'},
    {name: 'nav', title: 'Navigation'},
    {name: 'footer', title: 'Footer'},
    {name: 'contact', title: 'Contact & Social'},
    {name: 'tab', title: 'Browser Tab'},
  ],
  fields: [
    // ── Brand ────────────────────────────────────────────
    defineField({
      group: 'brand',
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'MAIN brand title shown in the navigation, page heroes and footer, e.g. DKNOTT.',
    }),
    defineField({
      group: 'brand',
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      description: 'Tagline shown under the brand, e.g. PHOTOGRAPHY.',
    }),
    defineField({
      group: 'brand',
      name: 'logo',
      title: 'Logo Image',
      type: 'cloudinary.asset',
      description: 'Main logo shown in the navigation bar and footer.',
    }),
    defineField({
      group: 'brand',
      name: 'creamColor',
      title: 'Cream Background Color',
      type: 'string',
      description: 'Hex code for the primary paper background (e.g. #F8F3E9). Kept for compatibility.',
    }),

    // ── Colors ───────────────────────────────────────────
    defineField({
      group: 'colors',
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'string',
      description: 'Hex code — main brand color used for headings (e.g. #9c9185).',
      initialValue: '#9c9185',
    }),
    defineField({
      group: 'colors',
      name: 'secondaryColor',
      title: 'Secondary Color',
      type: 'string',
      description: 'Hex code — supporting color for subtitles and muted text (e.g. #8c8378).',
      initialValue: '#8c8378',
    }),
    defineField({
      group: 'colors',
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex code — gold/brand accent used for highlights, dividers and buttons (e.g. #B08D4C).',
      initialValue: '#B08D4C',
    }),
    defineField({
      group: 'colors',
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex code — page paper background (e.g. #F8F3E9).',
      initialValue: '#F8F3E9',
    }),
    defineField({
      group: 'colors',
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex code — main body/ink text color (e.g. #262019).',
      initialValue: '#262019',
    }),

    // ── Fonts ────────────────────────────────────────────
    defineField({
      group: 'colors',
      name: 'headingFont',
      title: 'Heading Font',
      type: 'string',
      description: 'Google Font name for headings, e.g. Cinzel, Fraunces, Playfair Display.',
      initialValue: 'Cinzel',
    }),
    defineField({
      group: 'colors',
      name: 'bodyFont',
      title: 'Body Font',
      type: 'string',
      description: 'Google Font name for body text, e.g. Montserrat, Work Sans, Lato.',
      initialValue: 'Montserrat',
    }),

    // ── Navigation ───────────────────────────────────────
    defineField({
      group: 'nav',
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      description: 'Links shown in the top navigation bar, in order.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'href', title: 'Link URL (e.g. /about)', type: 'string'}),
          ],
        },
      ],
    }),

    // ── Footer ───────────────────────────────────────────
    defineField({
      group: 'footer',
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'text',
      rows: 2,
      description: 'Short brand line in the footer, e.g. "Documentary wedding photography and film, shot across India."',
    }),
    defineField({
      group: 'footer',
      name: 'footerText',
      title: 'Footer Bottom Text',
      type: 'string',
      description: 'Copyright line, e.g. "© 2026 DKNOTT Photography. All rights reserved."',
    }),

    // ── Contact ──────────────────────────────────────────
    defineField({
      group: 'contact',
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'e.g. dknottphotography3@gmail.com',
    }),
    defineField({
      group: 'contact',
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      description: 'e.g. +91 91107 08256',
    }),
    defineField({
      group: 'contact',
      name: 'contactAddress',
      title: 'Studio Address',
      type: 'string',
      description: 'e.g. Hyderabad, India',
    }),

    // ── Social ───────────────────────────────────────────
    defineField({
      group: 'contact',
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      group: 'contact',
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      group: 'contact',
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      group: 'contact',
      name: 'pinterestUrl',
      title: 'Pinterest URL',
      type: 'url',
    }),

    // ── Browser tab ──────────────────────────────────────
    defineField({
      group: 'tab',
      name: 'browserTabTitle',
      title: 'Browser Tab Title',
      type: 'string',
      description: 'Text shown in the browser tab, e.g. DKNOTT Photography.',
      initialValue: 'DKNOTT Photography',
    }),

    // ── Footer headings & CTA ────────────────────────────
    defineField({
      name: 'footerNavLinks',
      title: 'Footer Navigation Links',
      type: 'array',
      group: 'footer',
      description: 'Links in the footer "Navigate" column. Leave empty to mirror the main navigation.',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string'}),
          defineField({name: 'href', title: 'Link URL', type: 'string'}),
        ],
      }],
    }),
    defineField({
      group: 'footer',
      name: 'footerNavHeading',
      title: 'Footer "Navigate" Heading',
      type: 'string',
      description: 'Small heading above the footer link column.',
      initialValue: 'Navigate',
    }),
    defineField({
      group: 'footer',
      name: 'footerStudioHeading',
      title: 'Footer "Studio" Heading',
      type: 'string',
      description: 'Small heading above the studio contact column.',
      initialValue: 'Studio',
    }),
    defineField({
      group: 'footer',
      name: 'footerCtaLine1',
      title: 'Footer CTA Line 1',
      type: 'string',
      description: 'First line of the big footer call-to-action.',
      initialValue: 'Every knot tells a story.',
    }),
    defineField({
      group: 'footer',
      name: 'footerCtaLine2',
      title: 'Footer CTA Line 2',
      type: 'string',
      description: 'Second line of the big footer call-to-action.',
      initialValue: "Let's start yours.",
    }),
    defineField({
      group: 'footer',
      name: 'footerCtaButton',
      title: 'Footer CTA Button Label',
      type: 'string',
      description: 'Button under the footer call-to-action.',
      initialValue: 'Enquire about your date',
    }),
    defineField({
      group: 'footer',
      name: 'footerCtaHref',
      title: 'Footer CTA Button Link',
      type: 'string',
      description: 'Where the footer CTA button goes, e.g. /contact.',
      initialValue: '/contact',
    }),
    defineField({
      group: 'footer',
      name: 'backToTopLabel',
      title: '"Back to Top" Button Label',
      type: 'string',
      description: 'Accessibility label for the back-to-top button in the footer.',
      initialValue: 'Back to top',
    }),
    defineField({
      group: 'footer',
      name: 'instagramStripImages',
      title: 'Footer Instagram Strip Photos',
      type: 'array',
      description: 'Small photo strip shown above the footer on every page. Leave empty to keep the default photos.',
      of: [{type: 'cloudinary.asset'}],
    }),
  ],
})
