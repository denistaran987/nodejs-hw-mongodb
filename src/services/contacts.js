import { ContactsCollection } from '../db/models/contact.js';
import { validatePagination } from '../middlewares/validatePagination.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.find().merge(contactsQuery).countDocuments();

  const contacts = await contactsQuery.skip(skip).limit(limit).exec();

  validatePagination(contactsCount, perPage, page);
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = (contactId) => ContactsCollection.findById(contactId);
export const createContact = (payload) => ContactsCollection.create(payload);
export const deleteContact = (contactId) => ContactsCollection.findOneAndDelete({ _id: contactId });

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate({ _id: contactId }, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
  console.log(rawResult);

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
