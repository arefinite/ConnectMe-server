import { model, Schema } from 'mongoose'
import { PostType } from '../type/types'

const postSchema = new Schema<PostType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          default: '',
        },
      },
    ],
  },
  { timestamps: true }
)

export const Post = model<PostType>('Post', postSchema)
