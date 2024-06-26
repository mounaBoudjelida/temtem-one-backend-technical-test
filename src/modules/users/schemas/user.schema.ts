import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  versionKey: false,
})
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, lowercase: true })
  firstname: string;

  @Prop({ type: String, required: true, trim: true, lowercase: true })
  lastname: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, required: true, enum: Object.values(Role) })
  role: Role;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
