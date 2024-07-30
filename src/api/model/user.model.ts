import { model, Schema } from 'mongoose'
import { UserType } from '../type/types'

const userSchema = new Schema<UserType>(
  {
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    info: {
      type: String,
      default: '',
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: '',
    },
    coverImg: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

export const User = model<UserType>('User', userSchema)
