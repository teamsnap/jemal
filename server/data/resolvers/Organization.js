import { User, Organization } from '../models'
import transporter from '../../helpers/emailTransporter';

const OrganizationResolver = {
  Query: {
    currentOrganization: async (root, { _id }, { user }) => {

      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      const orgFound = await Organization.findOne({ _id }, (err, org) => { if (err) console.error(err) });

      return orgFound;
    },
  },
  Mutation: {
    createOrganization: async (root, { name, logoUrl }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!name) throw new Error('Must have a name');

      const createdById = user._id;
      const createdAt = Date.now();

      const organization = await Organization.create({
        name,
        createdById,
        createdAt,
        logoUrl,
      });

      await User.update({ _id: user._id }, { $set: { organizationId: organization._id }});

      return organization
    },
    inviteToOrganization: async (root, { email }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!email) throw new Error('Must have an email');

      const inviteUser = await User.findOne({ email });

      if(!inviteUser) throw new Error('Must be a valid user');

      const { organizationId } = await User.findOne({ _id: user._id });
      const { name } = await Organization.findOne({ _id: organizationId });

      const message = {
        from: 'sender@server.com',
        to: email,
        subject: `You have been invited to: ${name}`,
        text: `You have an invite pending for ${name} in the MJML Template Engine! Please click the following link http://localhost:3000/organization/accept/${organizationId}`,
        html: `<p>You have an invite pending for ${name} in the MJML Template Engine! Please click the following link <a href="http://localhost:3000/organization/accept/${organizationId}">http://localhost:3000/organization/accept/${organizationId}</a></p>`
      };

      transporter.sendMail(message, (error, response) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response);
        }
      });

      return inviteUser;
    },
    acceptToOrganization: async (root, { email, organizationId }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!email) throw new Error('Must have an email');

      const inviteUser = await User.findOne({ email });

      if(!inviteUser) throw new Error('Must be a valid user');

      const { name } = await Organization.findOne({ _id: organizationId });

      await User.update({ _id: user._id }, { $set: { organizationId }});

      const message = {
        from: 'sender@server.com',
        to: email,
        subject: `You have accecpted the invite to: ${name}`,
        text: `You have accepted the invite for ${name} in the MJML Template Engine!`,
        html: `<p>You have accepted the invite for ${name} in the MJML Template Engine!</p>`
      };

      transporter.sendMail(message, (error, response) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response);
        }
      });

      return user;
    }
  }
}

export default OrganizationResolver;
