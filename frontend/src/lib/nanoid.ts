/* eslint-disable import/prefer-default-export */
import { customAlphabet } from "nanoid";

const alphabets = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateId = (prefix: string) =>
	prefix.concat(customAlphabet(alphabets, 12)());
