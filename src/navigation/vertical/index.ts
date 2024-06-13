// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'vaadin:bar-chart-h',
      path: '/dashboard'
    },
    {
      sectionTitle: 'MENU DE NAVEGAÇÃO'
    },
    {
      title: 'Open Orders',
      icon: 'grommet-icons:document-outlook',
      path: '/openorders'
    },
    {
      title: 'New Order',
      icon: 'grommet-icons:document-notes',
      path: '/neworder'
    },
    {
      title: 'Closed Orders',
      icon: 'grommet-icons:document-excel',
      path: '/'
    },
    {
      title: 'Inspection Route',
      icon: 'fluent-mdl2:contact-info',
      path: '/'
    },
    {
      title: 'Weeekly Planning',
      icon: 'grommet-icons:document-time',
      path: '/'
    }
  ]
}

export default navigation
