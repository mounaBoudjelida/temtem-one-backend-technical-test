import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { logger } from 'src/utils/custom-logger.utils';
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
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    logger.error(error);
    return next(error);
  }
});

