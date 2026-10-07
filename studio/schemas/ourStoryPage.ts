import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ourStoryPage',
  title: 'Our Story Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'journey', title: 'The Journey Section'},
    {name: 'callout', title: 'Moments Callout'},
    {name: 'philosophy', title: 'Philosophy Section'},
    {name: 'craft', title: 'Luxury & Craft Section'},
    {name: 'lessons', title: 'Lessons Section'},
    {name: 'instinct', title: 'Behind the Scenes'},
    {name: 'purpose', title: 'Purpose Section'},
    {name: 'closing', title: 'Closing Signature'},
    {name: 'lovenotes', title: 'Love Notes'},
    {name: 'cta', title: 'Call to Action'},
  ],
  fields: [
    // ── Hero ───────────────────────────────────────────────
    defineField({
      group: 'hero',
      name: 'heroEyebrow',
      title: 'Hero Eyebrow Label',
      type: 'string',
      initialValue: 'Our Story',
    }),
    defineField({
      group: 'hero',
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Two people who couldn\'t stop photographing weddings.',
    }),
    defineField({
      group: 'hero',
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'cloudinary.asset',
    }),

    // ── How We Started ─────────────────────────────────────
    defineField({
      group: 'journey',
      name: 'startEyebrow',
      title: '"How We Started" Eyebrow',
      type: 'string',
      initialValue: 'How We Started',
    }),
    defineField({
      group: 'journey',
      name: 'startHeading',
      title: '"How We Started" Heading',
      type: 'string',
      initialValue: 'It began as a favour for a friend.',
    }),
    defineField({
      group: 'journey',
      name: 'startBody',
      title: '"How We Started" Body (first paragraph)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      group: 'journey',
      name: 'startBody2',
      title: '"How We Started" Body (second paragraph)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      group: 'journey',
      name: 'startImage',
      title: '"How We Started" Photo',
      type: 'cloudinary.asset',
    }),

    // ── Values ─────────────────────────────────────────────
    defineField({
      group: 'craft',
      name: 'valuesEyebrow',
      title: 'Values Section Eyebrow',
      type: 'string',
      initialValue: 'What We Believe',
    }),
    defineField({
      group: 'craft',
      name: 'valuesHeading',
      title: 'Values Section Heading',
      type: 'string',
      initialValue: 'Three things we won\'t compromise on',
    }),
    defineField({
      group: 'craft',
      name: 'values',
      title: 'Values Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),

    // ── Process Steps ──────────────────────────────────────
    defineField({
      group: 'lessons',
      name: 'processEyebrow',
      title: 'Process Section Eyebrow',
      type: 'string',
      initialValue: 'The Process',
    }),
    defineField({
      group: 'lessons',
      name: 'processHeading',
      title: 'Process Section Heading',
      type: 'string',
      initialValue: 'From "hello" to your gallery landing in your inbox',
    }),
    defineField({
      group: 'lessons',
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label (e.g. "01 · Inquire")', type: 'string' }),
            defineField({ name: 'body', title: 'Description', type: 'text', rows: 2 }),
          ],
        },
      ],
    }),

    // ── Love Notes / Testimonials ──────────────────────────
    defineField({
      group: 'lovenotes',
      name: 'loveNotesHeading',
      title: 'Love Notes Section Heading',
      type: 'string',
      initialValue: 'Love notes',
    }),
    defineField({
      group: 'lovenotes',
      name: 'loveNotes',
      title: 'Love Notes (Testimonials)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'couple', title: 'Couple Name', type: 'string' }),
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
            defineField({ name: 'photo', title: 'Couple Photo', type: 'cloudinary.asset' }),
          ],
        },
      ],
    }),

    // ── CTA ────────────────────────────────────────────────
    defineField({
      group: 'cta',
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      initialValue: 'Ready to talk dates?',
    }),
    defineField({
      group: 'cta',
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      initialValue: 'Get in touch',
    }),

    // ── Instagram Section ──────────────────────────────────
    defineField({
      group: 'cta',
      name: 'instagramHandle',
      title: 'Instagram Handle (display text)',
      type: 'string',
      initialValue: '@dknottphotography',
    }),
    defineField({
      group: 'cta',
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      initialValue: 'https://instagram.com/dknottphotography',
    }),

    // ── 12-Year Lessons (Pillars) ──────────────────────────
    defineField({
      group: 'cta',
      name: 'pillars',
      title: '"Lessons From The Craft" Pillars',
      type: 'array',
      description: 'The four numbered pillar cards. Leave empty to use the built-in lessons.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'num', title: 'Number (e.g. 01)', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
          ],
        },
      ],
    }),
    // ── Hero extras ──────────────────────────────────────
    defineField({
      name: 'heroSubheading',
      title: 'Hero Sub Line',
      type: 'string',
      group: 'hero',
      description: 'Small line under the hero name.',
    }),
    defineField({
      name: 'heroQuote',
      title: 'Hero Quote',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'Big quote on the hero band.',
    }),
    // ── Journey extras ───────────────────────────────────
    defineField({
      name: 'journeyEyebrow',
      title: 'Journey Eyebrow',
      type: 'string',
      group: 'journey',
      initialValue: 'BUILT ONE FRAME AT A TIME',
    }),
    defineField({
      name: 'journeyHeading',
      title: 'Journey Heading',
      type: 'string',
      group: 'journey',
      initialValue: 'Understanding People, Traditions & Fleeting Emotions',
    }),
    defineField({
      name: 'journeyBody',
      title: 'Journey Paragraphs',
      type: 'text',
      rows: 10,
      group: 'journey',
      description: 'One paragraph per blank line.',
    }),
    defineField({
      name: 'journeyImage',
      title: 'Journey Photo',
      type: 'cloudinary.asset',
      group: 'journey',
    }),
    defineField({
      name: 'journeyCaption',
      title: 'Journey Photo Caption',
      type: 'string',
      group: 'journey',
      initialValue: 'Davood • 12+ Years Documenting Real Moments',
    }),
    // ── Moments callout ──────────────────────────────────
    defineField({
      name: 'calloutEyebrow',
      title: 'Callout Eyebrow',
      type: 'string',
      group: 'callout',
      initialValue: 'THE MOMENTS THAT MATTER',
    }),
    defineField({
      name: 'calloutQuote',
      title: 'Callout Quote',
      type: 'string',
      group: 'callout',
      initialValue: '"A wedding is never just a wedding."',
    }),
    defineField({
      name: 'calloutBody',
      title: 'Callout Paragraph',
      type: 'text',
      rows: 6,
      group: 'callout',
    }),
    defineField({
      name: 'calloutHighlight',
      title: 'Callout Highlight Line',
      type: 'string',
      group: 'callout',
      initialValue: 'These are the moments that matter. And these are the moments worth chasing.',
    }),
    // ── Philosophy ───────────────────────────────────────
    defineField({
      name: 'philosophyEyebrow',
      title: 'Philosophy Eyebrow',
      type: 'string',
      group: 'philosophy',
      initialValue: 'THE PHILOSOPHY',
    }),
    defineField({
      name: 'philosophyHeading',
      title: 'Philosophy Heading',
      type: 'string',
      group: 'philosophy',
      initialValue: 'Do Not Force a Moment When You Can Discover a Real One',
    }),
    defineField({
      name: 'philosophyBody',
      title: 'Philosophy Paragraphs',
      type: 'text',
      rows: 8,
      group: 'philosophy',
      description: 'One paragraph per blank line. The italic verse goes in the pull-quote field.',
    }),
    defineField({
      name: 'philosophyPullquote',
      title: 'Philosophy Pull Quote',
      type: 'text',
      rows: 4,
      group: 'philosophy',
      description: 'The italic verse block. Blank lines become line breaks.',
    }),
    defineField({
      name: 'philosophyImage',
      title: 'Philosophy Photo',
      type: 'cloudinary.asset',
      group: 'philosophy',
    }),
    defineField({
      name: 'philosophyCaption',
      title: 'Philosophy Photo Caption',
      type: 'string',
      group: 'philosophy',
      initialValue: 'The Invisible Observer • Quiet Observation',
    }),
    // ── Luxury & craft ───────────────────────────────────
    defineField({
      name: 'craftEyebrow',
      title: 'Craft Eyebrow',
      type: 'string',
      group: 'craft',
      initialValue: 'WHERE LUXURY MEETS AUTHENTICITY',
    }),
    defineField({
      name: 'craftHeading',
      title: 'Craft Heading',
      type: 'string',
      group: 'craft',
      initialValue: 'Cinematic Visuals, Extraordinary Scale',
    }),
    defineField({
      name: 'craftBody',
      title: 'Craft Paragraphs',
      type: 'text',
      rows: 8,
      group: 'craft',
      description: 'One paragraph per blank line.',
    }),
    defineField({
      name: 'stylePillars',
      title: 'Style Pillars (4 cards)',
      type: 'array',
      group: 'craft',
      description: 'The four style cards, e.g. Elegant / When it needs to be.',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'title', title: 'Card Title', type: 'string'}),
          defineField({name: 'subtitle', title: 'Card Subtitle', type: 'string'}),
        ],
      }],
    }),
    // ── Lessons ──────────────────────────────────────────
    defineField({
      name: 'lessonsEyebrow',
      title: 'Lessons Eyebrow',
      type: 'string',
      group: 'lessons',
      initialValue: 'LESSONS FROM THE CRAFT',
    }),
    defineField({
      name: 'lessonsHeading',
      title: 'Lessons Heading',
      type: 'string',
      group: 'lessons',
      initialValue: 'Twelve Years of Constant Learning',
    }),
    defineField({
      name: 'lessonsIntro',
      title: 'Lessons Intro Paragraph',
      type: 'text',
      rows: 4,
      group: 'lessons',
    }),
    // ── Behind the scenes ────────────────────────────────
    defineField({
      name: 'instinctEyebrow',
      title: 'Instinct Eyebrow',
      type: 'string',
      group: 'instinct',
      initialValue: 'BEHIND THE SCENES • THE INSTINCT',
    }),
    defineField({
      name: 'instinctHeading',
      title: 'Instinct Heading',
      type: 'string',
      group: 'instinct',
      initialValue: 'More Than Experience — Built on Hard Work & Instinct',
    }),
    defineField({
      name: 'instinctBody',
      title: 'Instinct Paragraphs',
      type: 'text',
      rows: 8,
      group: 'instinct',
      description: 'One paragraph per blank line.',
    }),
    defineField({
      name: 'instinctPoints',
      title: 'Instinct Bullet Points',
      type: 'array',
      group: 'instinct',
      description: 'The four "ability" bullets. First part renders bold.',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'lead', title: 'Bold Lead', type: 'string'}),
          defineField({name: 'rest', title: 'Rest of Line', type: 'string'}),
        ],
      }],
    }),
    defineField({
      name: 'instinctImage',
      title: 'Instinct Photo',
      type: 'cloudinary.asset',
      group: 'instinct',
    }),
    defineField({
      name: 'instinctCaption',
      title: 'Instinct Photo Caption',
      type: 'string',
      group: 'instinct',
      initialValue: 'On Location • Preparation, Scouting & Craft',
    }),
    // ── Purpose ──────────────────────────────────────────
    defineField({
      name: 'purposeEyebrow',
      title: 'Purpose Eyebrow',
      type: 'string',
      group: 'purpose',
      initialValue: 'THE PURPOSE',
    }),
    defineField({
      name: 'purposeHeading',
      title: 'Purpose Heading',
      type: 'string',
      group: 'purpose',
      initialValue: 'Creating a Visual Legacy Across Generations',
    }),
    defineField({
      name: 'purposeBody',
      title: 'Purpose Paragraphs',
      type: 'text',
      rows: 8,
      group: 'purpose',
      description: 'One paragraph per blank line.',
    }),
    defineField({
      name: 'purposeQuote',
      title: 'Purpose Quote Box',
      type: 'text',
      rows: 4,
      group: 'purpose',
    }),
    defineField({
      name: 'purposeImage',
      title: 'Purpose Photo',
      type: 'cloudinary.asset',
      group: 'purpose',
    }),
    defineField({
      name: 'purposeCaption',
      title: 'Purpose Photo Caption',
      type: 'string',
      group: 'purpose',
      initialValue: 'A Visual Legacy • Preserving Memories for Generations',
    }),
    // ── Closing signature ────────────────────────────────
    defineField({
      name: 'closingQuote',
      title: 'Closing Quote',
      type: 'text',
      rows: 4,
      group: 'closing',
    }),
    defineField({
      name: 'closingName',
      title: 'Signature Name',
      type: 'string',
      group: 'closing',
      initialValue: 'DAVOOD',
    }),
    defineField({
      name: 'closingTitle',
      title: 'Signature Title Line',
      type: 'string',
      group: 'closing',
      initialValue: 'Unconventional Storyteller • Luxury Indian Weddings • Documentary Photography',
    }),
    defineField({
      name: 'closingTagline',
      title: 'Signature Tagline',
      type: 'string',
      group: 'closing',
      initialValue: 'Capturing what happened. Preserving how it felt.',
    }),
  ],
})
