import { sendError } from "./index";
import * as yup from "yup";

const validate = async (schema, reqData, res, next) => {
  try {
    await schema.validate(reqData, { abortEarly: false });
    next();
  } catch (e) {
    if (e.inner) {
      const errors = e.inner.map(({ path, message, value }) => ({
        path,
        message,
        value,
      }));
      sendError(res, errors, "Invalid Request");
    } else {
      sendError(res, [{ message: "Validation failed" }], "Invalid Request");
    }
  }
};

module.exports = {
  validateCreateUser: async (req, res, next) => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(), // Ensure it's a valid email
      profilePic: yup.string(),
    });
    await validate(schema, req.body, res, next);
  },

  validateCreateChannel: async (req, res, next) => {
    const schema = yup.object().shape({
      channelUsers: yup
        .array()
        .of(
          yup.object().shape({
            email: yup.string().email().required(), // Ensure it's a valid email
            name: yup.string().required(),
            profilePic: yup.string(),
          })
        )
        .min(2)
        .max(2)
        .required(),
    });
    await validate(schema, req.body, res, next);
  },

  validateGetChannelList: async (req, res, next) => {
    const schema = yup.object().shape({
      email: yup.string().email().required(), // Ensure it's a valid email
    });
    await validate(schema, req.query, res, next);
  },

  validateSearchUser: async (req, res, next) => {
    const schema = yup.object().shape({
      email: yup.string().email().required(), // Ensure it's a valid email
    });
    await validate(schema, req.query, res, next);
  },

  validateAddMessage: async (req, res, next) => {
    const schema = yup.object().shape({
      channelId: yup.string().required(),
      messages: yup.object().shape({
      senderEmail: yup.string().email().required(), 
      text: yup
      .string()
      .matches(/^[a-zA-Z0-9\s\.,\?!()'"-]*$/, 'Text must only contain letters, numbers, spaces, and common punctuation.')
      .required(),
      }),
    });
    await validate(schema, req.body, res, next);
  },
};
