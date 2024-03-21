import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type userDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
class User {
  @Prop({ type: String, required: true })
  wallet: string;

  @Prop({ type: String, default: null })
  name: string;

  @Prop(
    raw({
      email: { type: String, default: null },
      verify: { type: Boolean, default: false },
      verificationToken: { type: String },
    }),
  )
  emailData: Record<string, any>;

  @Prop({
    type: String,
    default: 'User',
    enum: ['User', 'Holder', 'Service', 'Editor', 'Admin'],
  })
  role: string;

  @Prop({ type: String, default: null })
  accessToken: string;

  @Prop({ type: String, default: null })
  refreshToken: string;
}

const userSchema = SchemaFactory.createForClass(User);

export { userSchema, userDocument, User };
