import { EmailPartial } from '../models'
import { saveTemplatePartial } from '../../helpers';

const EmailPartialResolver = {
  Query: {
    getEmailPartialsCount: async (root, { _id }, { user }) => {

      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      const emailPartialCount = await EmailPartial.count({ organizationId: _id }, (err, org) => { if (err) console.error(err) });

      return {
        count: emailPartialCount
      };
    },
    getAllEmailPartials: async (root, { _id, offset, limit }, { user }) => {

      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      let emailPartialsFound;

      if (offset || limit) {
        emailPartialsFound = await EmailPartial.find({ organizationId: _id }, (err, org) => { if (err) console.error(err) }).sort({ createdAt: 'desc' }).skip(offset).limit(limit);
      } else {
        emailPartialsFound = await EmailPartial.find({ organizationId: _id }, (err, org) => { if (err) console.error(err) }).sort({ createdAt: 'desc' });
      }

      return emailPartialsFound;
    },
    getCurrentEmailPartial: async (root, { _id }, { user }) => {

      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email partial id');

      const emailPartialsFound = await EmailPartial.findOne({ _id }, (err, org) => { if (err) console.error(err) });

      return emailPartialsFound;
    }
  },
  Mutation: {
    duplicateEmailPartial: async (root, { _id }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email partial Id');

      // ! if there are two email partials with the same folderPath we will have a conflict, must fix
      const { title, description, mjmlSource, organizationId, folderPath } = await EmailPartial.findOne({ _id });

      const createdById = user._id;
      const updatedById = user._id;
      const createdAt = Date.now();
      const updatedAt = Date.now();

      const newEmailPartial = await EmailPartial.create({
        title: `${title}${Date.now().toString().slice(-3)}`,
        description,
        mjmlSource,
        createdById,
        createdAt,
        updatedById,
        updatedAt,
        folderPath,
        organizationId,
        userId: user._id
      });

      await saveTemplatePartial(newEmailPartial.title, newEmailPartial.folderPath, newEmailPartial.mjmlSource)

      return newEmailPartial
    },
    deleteEmailPartial: async (root, { _id }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email partial Id');

      // todo: remove partials from fs on removal
      await EmailPartial.findOneAndRemove({ _id })

      return {_id: ''}
    },
    createEmailPartial: async (roots, { title, description, mjmlSource, organizationId, folderPath }, { user }) => {

      if (!user._id) throw new Error('Must be logged in');
      if (!organizationId) throw new Error('Must be associated with an organization');

      const createdById = user._id;
      const updatedById = user._id;
      const createdAt = Date.now();
      const updatedAt = Date.now();

      const emailPartial = await EmailPartial.create({
        title,
        description,
        mjmlSource,
        createdById,
        createdAt,
        updatedById,
        updatedAt,
        folderPath,
        organizationId,
        userId: user._id
      });

      return emailPartial
    },
    editEmailPartial: async (roots, { _id, title, description, mjmlSource, organizationId, folderPath }, { user }) => {

      if (!user._id) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have and email partial ID');
      if (!organizationId) throw new Error('Must be associated with an organization');
      if (mjmlSource === '') throw new Error('MJML must not be blank');
      if (title === '') throw new Error('Title must not be blank');

      const existingOrgId = await EmailPartial.findOne({ _id });

      if (organizationId !== existingOrgId.organizationId) throw new Error('Organization ID must match');

      const updatedById = user._id;
      const updatedAt = Date.now();

      await EmailPartial.update(
        { _id },
        { $set: {
          title,
          description,
          mjmlSource,
          folderPath,
          updatedById,
          updatedAt,
          organizationId,
        }
      });

      const updatedEmailPartial = await EmailPartial.findOne({ _id });
      const savedPartial = await saveTemplatePartial(updatedEmailPartial.title, updatedEmailPartial.mjmlSource);

      return updatedEmailPartial
    },
  },
}

export default EmailPartialResolver;
