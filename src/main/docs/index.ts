import components from './components'
import schemas from './schemas'
import paths from './paths'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores',
    version: '2.6.2',
    license: {
      name: 'MIT',
      url: 'https://github.com/RafaelCava/clean-node-types/blob/master/LICENSE'
    },
    contact: {
      name: 'Rafael Cavalcante',
      email: 'ra.facavalcante@hotmail.com',
      url: 'https://www.linkedin.com/in/rafael-cavalcantee/'
    }
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths,
  schemas,
  components
}
