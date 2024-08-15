import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
	title: string
	completed: boolean
	user: mongoose.Types.ObjectId
	createdAt: Date
	updatedAt: Date
}

const taskSchema: Schema = new Schema({
	title: {
		type: String,
		required: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
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

export default mongoose.model<ITask>('Task', taskSchema)
