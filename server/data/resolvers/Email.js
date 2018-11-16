import fs from 'fs-extra';

import { renderEmail, renderEmailLarge } from '../../helpers';
import { Email, User } from '../models';

// With async/await:
async function file(f) {
  return await fs.pathExists(f);
}

const EmailResolver = {
  Query: {
    getAllEmails: async (root, { _id, offset, limit }, { user }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      let emailsFound;
      let offsetTest;

      const images = async emailsFound => {
        // loop over to get images
        await emailsFound.forEach(async email => {
          // check if it exists, render if not
          const exists = await file(
            `./server/emails/screenshots/${email._id}.mjml.jpg`
          );
          if (!exists) {
            await renderEmail(`${email._id}.mjml`, email.mjmlSource);
          } else {
            return;
          }
        });
      };

      if (offset || limit) {
        emailsFound = await Email.find({ organizationId: _id }, (err, org) => {
          if (err) console.error(err);
        })
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: 'desc' });

        await images(emailsFound);
      } else {
        emailsFound = await Email.find({ organizationId: _id }, (err, org) => {
          if (err) console.error(err);
        }).sort({ createdAt: 'desc' });
        await images(emailsFound);
      }

      return emailsFound;
    },
    getFavoritedEmails: async (root, { _id, offset, limit }, { user }) => {
      if (!user) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have organization id');

      let emailsFound;
      let offsetTest;

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
    }
  },
  Email: {
    urlPreview: async email => {
      const templatePath = './server/emails/';
      const options = {};

      const emailRender = await renderEmail(
        `${email._id}.mjml`,
        email.mjmlSource
      );
      return emailRender.html;
    },
    screenshot: async email => {
      const exists = await file(
        `./server/emails/screenshots/${email._id}.mjml.jpg`
      );

      if (!exists) {
        return `${process.env.APP_URL}/public/placeholder.jpg`;
      } else {
        return `${process.env.APP_URL}/emails/screenshots/${
          email._id
        }.mjml.jpg`;
      }
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
        title: `${title}${Date.now()
          .toString()
          .slice(-3)}`,
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
        baseTemplate,
        userId: user._id
      });

      const emailRender = await renderEmail(
        `${newEmail._id}.mjml`,
        newEmail.mjmlSource
      );

      console.error(emailRender.errors);

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

      await Email.update(
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

      // todo: remove screenshots from fs on removal
      await Email.findOneAndRemove({ _id });

      return { _id: '' };
    },
    createCurrentEmailScreenshot: async (root, { _id }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email Id');

      const templatePath = './server/emails/';
      const { mjmlSource } = await Email.findOne({ _id });
      const screenshotDownloadUrl = await renderEmailLarge(
        `${_id}.mjml`,
        mjmlSource
      );

      return {
        _id,
        screenshotDownloadUrl
      };
    }
  }
};

export default EmailResolver;
