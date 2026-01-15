import { Role } from "@/role/schema/role.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true, unique: true, type: String })
    userName: string

    @Prop({ required: true, trim: true, unique: true, type: String })
    email: string

    @Prop({ required: true, trim: true, type: String })
    password: string

    @Prop({default: null, type: String})
    avatar: string | null

    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: Role.name })
    roleId: mongoose.Types.ObjectId
}

export const UserSchema = SchemaFactory.createForClass(User)
