import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
	username: string
	password: string
	comparePassword: (password: string) => Promise<boolean>
}

const userSchema: Schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
})

userSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) return next()
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
	return bcrypt.compare(password, this.password)
}

export default mongoose.model<IUser>('User', userSchema)
