import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
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
