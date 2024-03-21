import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Extend the Mongoose Document to include the User model for stronger typing in TypeScript.
type UserDocument = User & Document;

// Define the User schema using the @Schema decorator.
// The schema includes automatic timestamps for 'createdAt' and 'updatedAt'.
@Schema({ versionKey: false, timestamps: true })
class User {
  // Name property which defaults to null if not provided.
  @Prop({ type: String, default: null })
  name: string;

  // Email property which defaults to null if not provided.
  @Prop({ type: String, default: null, unique: true })
  email: string;

  // Mobile property which is required for every user entry.
  @Prop({ type: String, required: true })
  mobile: string;

  @Prop({ type: String, required: true })
  password: string;

  // AccessToken property for authentication, defaults to null if not provided.
  @Prop({ type: String, default: null })
  accessToken: string;

  // RefreshToken property for authentication, defaults to null if not provided.
  @Prop({ type: String, default: null })
  refreshToken: string;
}

// Generate the Mongoose schema for the User class.
const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema, UserDocument, User };
