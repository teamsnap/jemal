import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const EmailSchema = new Schema({
  title: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdById: { type: String },
  updatedAt: { type: Date, default: Date.now },
  updatedById: { type: String },
  mjmlSource: { type: String },
  baseTemplate: { type: String },
  duplicatedFrom: { type: String },
  folderPath: { type: String },
  favorited: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  hasBeenSent: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: false },
  organizationId: { type: String },
  baseTemplate: { type: Boolean, default: false }
});

const Email = mongoose.model('Email', EmailSchema);

export default Email;
