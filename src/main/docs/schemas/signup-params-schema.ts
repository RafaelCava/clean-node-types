export const signUpParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    passwordConfirmation: {
      type: 'string'
    },
    name: {
      type: 'string'
    }
  },
  required: ['email', 'password', 'passwordConfirmation', 'name']
}
