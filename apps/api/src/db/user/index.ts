import { createUserTable } from "./create";
import { findUserByName } from "./get";
import { insertUser } from "./insert";
import { updateUser } from "./update";

export const userDb = {
  createUserTable,
  insertUser,
  findUserByName,
  updateUser,
};
