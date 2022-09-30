import { InstagramPost } from './InstagramPost'

export const InstagramDefaultConfig = (slug = '') =>
  new InstagramPost({
    slug,
    width: 1080,
    height: 1080,
    fontSize: '36px',
    fonts: {
      topLink: {
        color: 'white',
        size: '1em',
        family: 'Courier',
        lineHeight: 1.5,
      },
      title: {
        color: '#006377',
        size: '2em',
        family: 'Futura',
        lineHeight: 3,
      },
      subtitle: {
        color: 'black',
        size: '1.2em',
        family: 'Helvetica',
        lineHeight: 1.5,
      },
      footer: {
        color: 'white',
        size: '1em',
        family: 'Helvetica',
        lineHeight: 1.5,
      },
    },
  })
