import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      description: 'Used in navigation and footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainMenu',
      title: 'Main Navigation Menu',
      type: 'array',
      description: 'Configure the main navigation menu with optional submenus',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Text to display in the menu',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'link',
              title: 'Link',
              type: 'string',
              description: 'URL path (e.g., /about, /services). If submenu items exist, this becomes the parent link.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'submenu',
              title: 'Submenu Items',
              type: 'array',
              description: 'Optional dropdown menu items',
              of: [
                {
                  type: 'object',
                  name: 'submenuItem',
                  title: 'Submenu Item',
                  fields: [
                    {
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'link',
                      title: 'Link',
                      type: 'string',
                      description: 'URL path (e.g., /services/structural-engineering)',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      description: 'Optional short description for the submenu item',
                      rows: 2,
                    },
                  ],
                  preview: {
                    select: {
                      title: 'label',
                      subtitle: 'link',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'link',
              submenu: 'submenu',
            },
            prepare({title, subtitle, submenu}) {
              return {
                title,
                subtitle: submenu?.length ? `${subtitle} (${submenu.length} submenu items)` : subtitle,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Displayed in footer on all pages',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Contact Phone',
      type: 'string',
      description: 'Displayed in footer on all pages',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Default image for social media sharing (Open Graph) across all pages. Recommended 1200x630px.',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
