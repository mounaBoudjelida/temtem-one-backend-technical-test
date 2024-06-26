import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from 'src/enums/category.enum';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({
  collection: 'products',
  versionKey: false,
})
export class Product {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true, enum: Object.values(Category) })
  category: Category;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Boolean, default: false })
  isArchived: boolean; //Soft Delete

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
