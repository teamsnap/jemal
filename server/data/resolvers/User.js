import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs-extra';

import { User, Organization, EmailPartial } from '../models';
import transporter from '../../helpers/emailTransporter';

const UserResolver = {
  Query: {
    currentUser: async (root, args, { user }) => {
      if (!user) throw new Error('Must be logged in');

      const _id = user._id;
      const userFound = await User.findOne({ _id }, (err, user) => {
        if (err) console.error(err);
      });

      return userFound;
    }
  },
  User: {
    organization: async ({ organizationId }, args, context) => {
      const orgFound = await Organization.findOne(
        { _id: organizationId },
        (err, org) => {
          if (err) console.error(err);
        }
      );

      return orgFound;
    }
  },
  Mutation: {
    login: async (root, { email, password }, {}) => {
      if (!email) throw new Error('Email or password was not provided');
      if (!password) throw new Error('Email or password was not provided');

      const user = await User.findOne({ email });
      if (!user) throw new Error('Email not found');

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error('Password is incorrect');

      // Generate the jwt and add it to the user document being returned.
      user.jwt = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      // On login download all partials for rendering
      // the resolver will update on save if any changes
      // we just need the initial partials to render
      const templatePath = './emails/templates-partials';
      const options = {};

      async function saveTemplatePartial(file, folderPath, source) {
        try {
          await fs.outputFile(
            `${templatePath}${folderPath}/${file
              .replace(/\s+/g, '-')
              .toLowerCase()}.mjml`,
            source
          );
        } catch (err) {
          throw new Error(err);
        }
      }

      const emailPartialsFound = await EmailPartial.find(
        { organizationId: user.organizationId },
        (err, org) => {
          if (err) console.error(err);
        }
      );

      emailPartialsFound.forEach(me => {
        saveTemplatePartial(me.title, me.folderPath, me.mjmlSource);
      });

      // Return signed token

      return user;
    },
    signup: async (root, { email, password, firstname, lastname }, {}) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('Email already used');

      const hash = await bcrypt.hash(password, 10);

      await User.create({
        email,
        username: email,
        firstname,
        lastname,
        password: hash
      });

      const message = {
        from: 'sender@server.com',
        to: email,
        subject: 'Welcome to the engine!',
        text: `Your account has been created with email ${email}. Enjoy creating some emails!`,
        html: `<p>Your account has been created with email ${email}. Enjoy creating some emails!</p>`
      };

      transporter.sendMail(message, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: ' + response);
        }
      });

      const user = await User.findOne({ email });

      // Generate the jwt and add it to the user document being returned.
      user.jwt = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      return user;
    },
    requestResetPassword: async (root, { email }, {}) => {
      const resetPasswordToken = await crypto.randomBytes(48).toString('hex');
      // expires in 1 hour
      const resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000;
      const url = process.env.APP_URL || process.env.NOW_URL;

      const message = {
        from: 'sender@server.com',
        to: email,
        subject: 'Password reset',
        text: `${url}/forgot/${resetPasswordToken}`,
        html: `<p><a href="${url}/forgot/${resetPasswordToken}">${url}/forgot/${resetPasswordToken}</a></p>`
      };

      await User.update(
        { email },
        {
          $set: {
            resetPasswordToken,
            resetPasswordExpires
          }
        }
      );

      transporter.sendMail(message, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: ' + response);
        }
      });

      const user = await User.findOne({ email });

      return user;
    },
    changePassword: async (
      root,
      { newPassword, verifyPassword, resetPasswordToken, email },
      {}
    ) => {
      if (newPassword === '') throw new Error('Password not provided');
      if (verifyPassword === '') throw new Error('Password not provided');

      const message = {
        from: 'sender@server.com',
        to: email,
        subject: 'Password has been reset',
        text: `Your password for ${email} has been reset`,
        html: `<p>Your password for ${email} has been reset</p>`
      };

      if (resetPasswordToken) {
        const user = await User.findOne({ email, resetPasswordToken });

        if (Date.parse(user.resetPasswordExpires) <= Date.now()) {
          throw new Error('Token has expired, please request again');
        } else if (newPassword !== verifyPassword) {
          throw new Error("Passwords don't match, please try again.");
        } else {
          const hash = await bcrypt.hash(newPassword, 10);

          await User.update(
            { email },
            {
              $set: {
                password: hash,
                resetPasswordToken: '',
                resetPasswordExpires: ''
              }
            }
          );

          transporter.sendMail(message, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Message sent: ' + response);
            }
          });

          // Generate the jwt and add it to the user document being returned.
          user.jwt = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

          return user;
        }
      } else {
        if (!email) throw new Error('Must be logged in');
        if (newPassword !== verifyPassword)
          throw new Error("Passwords don't match, please try again.");

        const user = await User.findOne({ email });

        const hash = await bcrypt.hash(newPassword, 10);

        await User.update(
          { email },
          {
            $set: {
              password: hash
            }
          }
        );

        transporter.sendMail(message, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Message sent: ' + response);
          }
        });

        // Generate the jwt and add it to the user document being returned.
        user.jwt = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        return user;
      }
    }
  }
};

export default UserResolver;
