import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'cqd974oj',
  dataset: 'production',
  useCdn: false, // Set to false so you instantly see updates without caching!
  apiVersion: '2024-03-20',
})

