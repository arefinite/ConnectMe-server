import { ObjectId, Types } from 'mongoose'

export type UserType = {
  fullName: string
  password: string
  email: string
  followers: string[]
  following: string[]
  profileImg: string
  coverImg: string
  link: string
  info: string
}

export type NotificationType = {
  from: Types.ObjectId
  to: Types.ObjectId
  type: 'follow' | 'like' | 'comment'
  read: boolean
}

export type PostType = {
  user: Types.ObjectId
  text: string
  image: string
  likes: Types.ObjectId[]
  comments: {
    user: Types.ObjectId
    text: string
  }[]
  
}