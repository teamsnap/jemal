const fetch = require('node-fetch');

const { Email, User, EmailPartial } = require('../models');

const EmailResolver = {
  Query: {
    getAllEmails: async (root, { _id, offset, limit }, { user }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      let emailsFound;

      if (offset || limit) {
        emailsFound = await Email.find({ organizationId: _id }, (err, org) => {
          if (err) console.error(err);
        })
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: 'desc' });
      } else {
        emailsFound = await Email.find({ organizationId: _id }, (err, org) => {
          if (err) console.error(err);
        }).sort({ createdAt: 'desc' });
      }

      return emailsFound;
    },
    getFavoritedEmails: async (root, { _id, offset, limit }, { user }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      let emailsFound;

      if (offset || limit) {
        emailsFound = await Email.find(
          {
            organizationId: _id,
            favorited: true
          },
          (err, org) => {
            if (err) console.error(err);
          }
        )
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: 'desc' });
      } else {
        emailsFound = await Email.find(
          { organizationId: _id, favorited: true },
          (err, org) => {
            if (err) console.error(err);
          }
        ).sort({ createdAt: 'desc' });
      }

      return emailsFound;
    },
    getEmailsCount: async (root, { _id }, { user }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      const emailCount = await Email.count(
        { organizationId: _id },
        (err, org) => {
          if (err) console.error(err);
        }
      );

      return {
        count: emailCount
      };
    },
    getFavoritedEmailsCount: async (root, { _id }, { user }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      const emailCount = await Email.count(
        { organizationId: _id, favorited: true },
        (err, org) => {
          if (err) console.error(err);
        }
      );

      return {
        count: emailCount
      };
    },
    getBaseTemplateEmails: async (root, { _id, baseTemplate }, { user }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      const emails = await Email.find(
        { organizationId: _id, baseTemplate },
        (err, org) => {
          if (err) console.error(err);
        }
      );

      return emails;
    },
    getCurrentEmail: async (root, { _id }, { user }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email id');

      const userId = user._id;
      const userFound = await User.findOne({ _id: userId });
      const emailFound = await Email.findOne({ _id });

      // Throw error if userOrg id doesn't match org id of email
      if (userFound.organizationId !== emailFound.organizationId)
        throw new Error(
          'Must be associated with a certain organization to view this email'
        );

      return emailFound;
    },
    getCurrentPublicEmail: async (root, { _id }, context) => {
      if (!_id) throw new Error('Must have email id');

      const emailFound = await Email.findOne({ _id });

      return emailFound;
    },
    getCurrentEmailScreenshot: async (root, { _id }, { user, appUrl }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email id');

      const userFound = await User.findOne({ _id: user._id });

      const emailPartialsFound = await EmailPartial.find(
        { organizationId: userFound.organizationId },
        (err, org) => {
          if (err) console.error(err);
        }
      );

      const emailFound = await Email.findOne({ _id });

      const body = JSON.stringify({
        _id: _id,
        mjmlSource: emailFound.mjmlSource,
        partials: emailPartialsFound,
        options: {
          type: 'jpeg',
          clip: { x: 0, y: 0, width: 400, height: 205 }
        }
      });

      const fetchScreenshot = await fetch(`${appUrl}/screenshot/${_id}`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
      });

      const buffer = await fetchScreenshot.buffer();
      const base64 = buffer.toString('base64');
      const base64Image = `data:image/jpeg;base64,${base64}`;

      return {
        image: base64Image
      };
    }
  },
  Email: {
    urlPreview: async (root, {}, { user, appUrl }) => {
      let emailPartialsFound;

      if (root.organizationId) {
        emailPartialsFound = await EmailPartial.find(
          { organizationId: root.organizationId },
          (err, org) => {
            if (err) console.error(err);
          }
        );
      } else {
        const userFound = await User.findOne({ _id: user._id });
        emailPartialsFound = await EmailPartial.find(
          { organizationId: userFound.organizationId },
          (err, org) => {
            if (err) console.error(err);
          }
        );
      }

      const body = JSON.stringify({
        _id: root._id,
        mjmlSource: root.mjmlSource,
        partials: emailPartialsFound
      });

      const fetchEmail = await fetch(`${appUrl}/renderEmail`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
      });

      const emailRender = await fetchEmail.json();

      return emailRender.html;
    },
    screenshot: async (root, {}, { user, appUrl }) => {
      const userFound = await User.findOne({ _id: user._id });

      const emailPartialsFound = await EmailPartial.find(
        { organizationId: userFound.organizationId },
        (err, org) => {
          if (err) console.error(err);
        }
      );

      const body = JSON.stringify({
        _id: root._id,
        mjmlSource: root.mjmlSource,
        partials: emailPartialsFound,
        options: {
          type: 'jpeg',
          clip: { x: 0, y: 0, width: 400, height: 205 }
        }
      });

      const fetchScreenshot = await fetch(`${appUrl}/screenshot/${root._id}`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
      });

      const buffer = await fetchScreenshot.buffer();
      const base64 = buffer.toString('base64');
      const base64Image = `data:image/jpeg;base64,${base64}`;

      return base64Image;
    }
  },
  Mutation: {
    createEmail: async (
      roots,
      {
        title,
        description,
        mjmlSource,
        baseTemplate,
        duplicatedFrom,
        folderId,
        favorited,
        isApproved,
        hasBeenSent,
        isDraft,
        organizationId
      },
      { user }
    ) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!organizationId)
        throw new Error('Must be associated with an organization');

      const createdById = user._id;
      const updatedById = user._id;
      const createdAt = Date.now();
      const updatedAt = Date.now();

      const email = await Email.create({
        title,
        description,
        mjmlSource,
        baseTemplate,
        duplicatedFrom,
        folderId,
        favorited,
        isApproved,
        hasBeenSent,
        isDraft,
        createdById,
        createdAt,
        updatedById,
        updatedAt,
        organizationId,
        userId: user._id
      });

      return email;
    },
    duplicateEmail: async (root, { _id }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email Id');

      const {
        title,
        description,
        mjmlSource,
        duplicatedFrom,
        folderId,
        organizationId,
        baseTemplate = false
      } = await Email.findOne({ _id });

      const createdById = user._id;
      const updatedById = user._id;
      const createdAt = Date.now();
      const updatedAt = Date.now();

      const newEmail = await Email.create({
        title: `${title}${Date.now().toString().slice(-3)}`,
        description,
        mjmlSource,
        baseTemplate,
        duplicatedFrom,
        folderId,
        favorited: false,
        isApproved: false,
        hasBeenSent: false,
        isDraft: true,
        createdById,
        createdAt,
        updatedById,
        updatedAt,
        organizationId,
        userId: user._id
      });

      return newEmail;
    },
    editEmail: async (
      roots,
      {
        _id,
        title,
        description,
        mjmlSource,
        baseTemplate,
        duplicatedFrom,
        folderId,
        favorited,
        isApproved,
        hasBeenSent,
        isDraft,
        organizationId
      },
      { user }
    ) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have and email ID');
      if (!organizationId)
        throw new Error('Must be associated with an organization');
      if (mjmlSource === '') throw new Error('MJML must not be blank');
      if (title === '') throw new Error('Title must not be blank');

      const existingOrgId = await Email.findOne({ _id });

      if (organizationId !== existingOrgId.organizationId)
        throw new Error('Organization ID must match');

      const updatedById = user._id;
      const updatedAt = Date.now();

      await Email.updateOne(
        { _id },
        {
          $set: {
            title,
            description,
            mjmlSource,
            baseTemplate,
            duplicatedFrom,
            folderId,
            favorited,
            isApproved,
            hasBeenSent,
            isDraft,
            updatedById,
            updatedAt
          }
        }
      );

      const updatedEmail = await Email.findOne({ _id });

      return updatedEmail;
    },
    deleteEmail: async (root, { _id }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email Id');

      await Email.findOneAndRemove({ _id });

      return { _id: '' };
    },
    createCurrentEmailScreenshot: async (
      root,
      { _id, orgId },
      { user, appUrl }
    ) => {
      let emailPartialsFound;
      if (orgId) {
        emailPartialsFound = await EmailPartial.find(
          { organizationId: orgId },
          (err, org) => {
            if (err) console.error(err);
          }
        );
      } else {
        if (!user._id) throw new Error('Must be logged in');
        if (!_id) throw new Error('Must have email Id');

        const userFound = await User.findOne({ _id: user._id });
        emailPartialsFound = await EmailPartial.find(
          { organizationId: userFound.organizationId },
          (err, org) => {
            if (err) console.error(err);
          }
        );
      }

      const { mjmlSource } = await Email.findOne({ _id });

      const body = JSON.stringify({
        _id: _id,
        mjmlSource: mjmlSource,
        partials: emailPartialsFound,
        options: {
          type: 'jpeg',
          fullPage: true
        }
      });
      const fetchScreenshot = await fetch(`${appUrl}/screenshot/${_id}`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
      });
      const buffer = await fetchScreenshot.buffer();
      const base64 = buffer.toString('base64');
      const base64Image = `data:image/jpeg;base64,${base64}`;

      return {
        _id,
        screenshotDownloadUrl: base64Image
      };
    }
  }
};

module.exports = EmailResolver;
