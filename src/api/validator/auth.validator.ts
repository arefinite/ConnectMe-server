import { check } from 'express-validator'

export const signUpValidator = [
  check('fullName', 'Full name is required').isString().isLength({ max: 50 }),
  check('email', 'Please input a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({
    min: 6,
  }),
]

export const signInValidator = [
  check('email', 'Please input a valid email').isEmail(),
  check('password', 'Password is required').exists(),
]
