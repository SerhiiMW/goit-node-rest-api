import * as contactsService from "../services/contactsServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

const getAllContacts = async (req, res, next) => {
    try {
        const result = await contactsService.listContacts();

        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await contactsService.getContactById(id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }

        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const deleteContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await contactsService.removeContact(id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }

        res.json(
            result
        );
    }
    catch(error) {
        next(error);
    }
};

const createContact = async (req, res, next) => {
    try {
        const {error} = createContactSchema.validate(req.body);
        if(error) {
            throw HttpError(400, error.message);
        }
        const result = await contactsService.addContact(req.body);

        res.status(201).json(result);
    }
    catch(error) {
        next(error);
    }
};

const updateContact = async (req, res, next) => {
    try {
        const {error} = updateContactSchema.validate(req.body);
        if(error) {
            throw HttpError(400, error.message);
        }
        const {id} = req.params;
        const result = await contactsService.updateContactById(id, req.body);
        if(Object.keys(req.body).length === 0) {
            throw HttpError(400, `Body must have at least one field`);
        }

        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
    }
    catch(error) {
        next(error);
    }
};

const updateStatusContact = async (req, res, next) => {
    try {
        const {error} = updateContactSchema.validate(req.body);
        if(error) {
            throw HttpError(400, error.message);
        }
        const {id} = req.params;
        const result = await contactsService.updateStatusContact(id, req.body);
        if(Object.keys(req.body).length === 0) {
            throw HttpError(400, `Body must have at least one field`);
        }

        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.json(result);
    }
    catch(error) {
        next(error);
    }
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    deleteContact: ctrlWrapper(deleteContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
}