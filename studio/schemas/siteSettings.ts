import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Global brand settings applied across the whole website.',
  fields: [
    // ── Brand ────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'MAIN brand title shown in the navigation, page heroes and footer, e.g. DKNOTT.',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      description: 'Tagline shown under the brand, e.g. PHOTOGRAPHY.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo Image',
      type: 'cloudinary.asset',
      description: 'Main logo shown in the navigation bar and footer.',
    }),
    defineField({
      name: 'creamColor',
      title: 'Cream Background Color',
      type: 'string',
      description: 'Hex code for the primary paper background (e.g. #F8F3E9). Kept for compatibility.',
    }),

    // ── Colors ───────────────────────────────────────────
    defineField({
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'string',
      description: 'Hex code — main brand color used for headings (e.g. #9c9185).',
      initialValue: '#9c9185',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Color',
      type: 'string',
      description: 'Hex code — supporting color for subtitles and muted text (e.g. #8c8378).',
      initialValue: '#8c8378',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex code — gold/brand accent used for highlights, dividers and buttons (e.g. #B08D4C).',
      initialValue: '#B08D4C',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex code — page paper background (e.g. #F8F3E9).',
      initialValue: '#F8F3E9',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex code — main body/ink text color (e.g. #262019).',
      initialValue: '#262019',
    }),

    // ── Fonts ────────────────────────────────────────────
    defineField({
      name: 'headingFont',
      title: 'Heading Font',
      type: 'string',
      description: 'Google Font name for headings, e.g. Cinzel, Fraunces, Playfair Display.',
      initialValue: 'Cinzel',
    }),
    defineField({
      name: 'bodyFont',
      title: 'Body Font',
      type: 'string',
      description: 'Google Font name for body text, e.g. Montserrat, Work Sans, Lato.',
      initialValue: 'Montserrat',
    }),

    // ── Navigation ───────────────────────────────────────
    defineField({
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
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'text',
      rows: 2,
      description: 'Short brand line in the footer, e.g. "Documentary wedding photography and film, shot across India."',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Bottom Text',
      type: 'string',
      description: 'Copyright line, e.g. "© 2026 DKNOTT Photography. All rights reserved."',
    }),

    // ── Contact ──────────────────────────────────────────
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'e.g. dknottphotography3@gmail.com',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      description: 'e.g. +91 91107 08256',
    }),
    defineField({
      name: 'contactAddress',
      title: 'Studio Address',
      type: 'string',
      description: 'e.g. Hyderabad, India',
    }),

    // ── Social ───────────────────────────────────────────
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'pinterestUrl',
      title: 'Pinterest URL',
      type: 'url',
    }),

    // ── Browser tab ──────────────────────────────────────
    defineField({
      name: 'browserTabTitle',
      title: 'Browser Tab Title',
      type: 'string',
      description: 'Text shown in the browser tab, e.g. DKNOTT Photography.',
      initialValue: 'DKNOTT Photography',
    }),

    // ── Footer headings & CTA ────────────────────────────
    defineField({
      name: 'footerNavHeading',
      title: 'Footer "Navigate" Heading',
      type: 'string',
      description: 'Small heading above the footer link column.',
      initialValue: 'Navigate',
    }),
    defineField({
      name: 'footerStudioHeading',
      title: 'Footer "Studio" Heading',
      type: 'string',
      description: 'Small heading above the studio contact column.',
      initialValue: 'Studio',
    }),
    defineField({
      name: 'footerCtaLine1',
      title: 'Footer CTA Line 1',
      type: 'string',
      description: 'First line of the big footer call-to-action.',
      initialValue: 'Every knot tells a story.',
    }),
    defineField({
      name: 'footerCtaLine2',
      title: 'Footer CTA Line 2',
      type: 'string',
      description: 'Second line of the big footer call-to-action.',
      initialValue: "Let's start yours.",
    }),
    defineField({
      name: 'footerCtaButton',
      title: 'Footer CTA Button Label',
      type: 'string',
      description: 'Button under the footer call-to-action.',
      initialValue: 'Enquire about your date',
    }),
    defineField({
      name: 'footerCtaHref',
      title: 'Footer CTA Button Link',
      type: 'string',
      description: 'Where the footer CTA button goes, e.g. /contact.',
      initialValue: '/contact',
    }),
    defineField({
      name: 'backToTopLabel',
      title: '"Back to Top" Button Label',
      type: 'string',
      description: 'Accessibility label for the back-to-top button in the footer.',
      initialValue: 'Back to top',
    }),
    defineField({
      name: 'instagramStripImages',
      title: 'Footer Instagram Strip Photos',
      type: 'array',
      description: 'Small photo strip shown above the footer on every page. Leave empty to keep the default photos.',
      of: [{type: 'cloudinary.asset'}],
    }),
  ],
})
