import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  name: string
  password: string
  createdAt: Date
  updatedAt: Date
  avatar?: string
  bio?: string
}

export interface UserDocument extends User {
  _id: ObjectId
}
