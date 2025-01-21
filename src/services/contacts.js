import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = () => ContactsCollection.find();
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
