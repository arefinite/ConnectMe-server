import { model, Schema } from 'mongoose'
import { NotificationType } from '../type/types'

const notificationSchema = new Schema<NotificationType>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['follow', 'like', 'comment'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const Notification = model<NotificationType>(
  'Notification',
  notificationSchema
)
