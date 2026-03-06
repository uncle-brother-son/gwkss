import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

// Helper to create singleton list items
const singletonItem = (S: any, schemaType: string, title: string) =>
  S.listItem()
    .title(title)
    .id(schemaType)
    .child(
      S.editor()
        .id(schemaType)
        .schemaType(schemaType)
        .documentId(schemaType)
        .views([S.view.form()])
    )

export default defineConfig({
  name: 'default',
  title: 'gwkss',

  projectId: 'ddua7oi6',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            singletonItem(S, 'home', 'Home'),
            S.listItem()
              .title('Services')
              .child(
                S.list()
                  .title('Services')
                  .items([
                    singletonItem(S, 'servicesPage', 'Services Overview'),
                    S.divider(),
                    S.listItem()
                      .title('Service Pages')
                      .schemaType('service')
                      .child(S.documentTypeList('service').title('Service Pages')),
                  ])
              ),
            singletonItem(S, 'about', 'About'),
            singletonItem(S, 'contact', 'Contact'),
            S.divider(),
            singletonItem(S, 'siteSettings', 'Site Settings'),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, {schemaType}) => {
      const singletonTypes = ['home', 'servicesPage', 'about', 'contact', 'siteSettings']
      
      if (singletonTypes.includes(schemaType)) {
        return prev.filter(
          ({action}) => !['unpublish', 'delete', 'duplicate'].includes(action as string)
        )
      }
      return prev
    },
    newDocumentOptions: (prev, {creationContext}) => {
      const singletonTypes = ['home', 'servicesPage', 'about', 'contact', 'siteSettings']
      
      if (creationContext.type === 'global') {
        return prev.filter(
          (template) => !singletonTypes.includes(template.templateId)
        )
      }
      return prev
    },
  },
})
