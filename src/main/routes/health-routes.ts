import { Router } from 'express'

export default (router: Router): void => {
  router.get('/', (req, res) => {
    return res.status(200).json()
  })
}
