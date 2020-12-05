/** a category of characters */
export enum CharClass {
  LowerCaseLetters = "Letters",
  UpperCaseLetters = "Capitals",
  Numbers = "Numbers",
  Symbols = "Symbols",
}

/** a list of all classes */
export const AllClasses = Object.freeze(Object.values(CharClass) as Array<CharClass>);

/** a map from character class to contained characters */
export const ClassChars: Readonly<Record<CharClass, string>> = Object.freeze({
  [CharClass.LowerCaseLetters]: "abcdefghijklmnopqrstuvwxyz",
  [CharClass.UpperCaseLetters]: "ABCDEFGHIKLMNOPQRSTUVXYZ",
  [CharClass.Numbers]: "0123456789",
  [CharClass.Symbols]: "!\"$%^'()*+,-./:;<=>?@[\\]^_`",
});

/** a charset is a list of included CharClasses */
export type CharSet = Record<CharClass, boolean>;

/* returns a new charset */
export function NewCharset(): CharSet {
  const charset = Object.fromEntries(
    AllClasses.map(clz => [clz, true])
  ) as CharSet;

  charset[CharClass.Symbols] = false;
  
  return charset;
}

/** given a charset, return the list of contained characters */
export function CharsetToString(charset: CharSet): string {
  return Object.entries(charset)
    .filter(([_, included]) => included)
    .map(([clz, _]) => ClassChars[clz])
    .join("");
}