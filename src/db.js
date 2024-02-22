import Dexie from "dexie";

export const db = new Dexie("localcontacts");
db.version(1).stores({
    contacts: '++id, name, address'
});