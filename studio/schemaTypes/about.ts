import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'image',
      title: 'Featured Image (Desktop)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image for desktop/tablet screens',
    }),
    defineField({
      name: 'mobileImage',
      title: 'Featured Image (Mobile)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image for mobile screens. If not set, desktop image will be used.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description. Recommended 150-160 characters.',
      validation: (Rule) => Rule.max(160),
    }),
  ],
})
