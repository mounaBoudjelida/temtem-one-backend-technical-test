import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from 'src/enums/category.enum';

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
}

export const ProductSchema = SchemaFactory.createForClass(Product);
