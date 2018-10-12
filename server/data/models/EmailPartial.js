import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const EmailPartialSchema = new Schema({
  title: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdById: { type: String },
  updatedAt: { type: Date, default: Date.now },
  updatedById: { type: String },
  folderPath: { type: String },
  mjmlSource: { type: String },
  organizationId: { type: String }
});

const EmailPartial = mongoose.model('EmailPartial', EmailPartialSchema);

export default EmailPartial;
