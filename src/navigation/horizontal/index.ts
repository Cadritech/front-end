// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'material-symbols:dashboard-customize-rounded'
    },
    {
      title: 'Open Orders',
      icon: 'bx:circle',
      path: '/openorders'
    },
    {
      title: 'New Order',
      icon: 'bx:circle',
      path: '/'
    },
    {
      title: 'Closed Orders',
      icon: 'bx:circle',
      path: '/'
    },
    {
      title: 'Inspection Route',
      icon: 'bx:circle',
      path: '/'
    },
    {
      title: 'Weeekly Planning',
      icon: 'bx:circle',
      path: '/'
    }
  ]
}

export default navigation
