import {
  hasWhiteSpace,
  isDigitOnly,
  isEmail,
  isEmptyStr
} from '~lib/common/extensions/strings';

import { Validator } from './base';

interface SpecialCharOption {
  errMsg?: string;
  accept?: string;
}

export class ValidatorString extends Validator {
  static init(v: string | null): ValidatorString {
    return new ValidatorString(v);
  }

  notEmpty(errMsg: string = `Can't be empty`): ValidatorString {
    this.validate((v: string) => (isEmptyStr(v) ? errMsg : undefined));
    return this;
  }

  noWhitespace(errMsg: string = 'No whitespace allowed'): ValidatorString {
    this.validate((v: string) => (hasWhiteSpace(v) ? errMsg : undefined));
    return this;
  }

  minLength(val: number, errMsg?: (v: number) => string): ValidatorString {
    const err = errMsg?.(val) || `Min Length = ${val}`;

    this.validate((v: string) => (v.length >= val ? undefined : err));
    return this;
  }

  digitOnly(errMsg: string = 'Only numbers allowed'): ValidatorString {
    this.validate((v: string) => (isDigitOnly(v) ? undefined : errMsg));
    return this;
  }

  noSpecial(option: SpecialCharOption): ValidatorString {
    const { errMsg = 'No special characters allowed', accept = '' } = option;

    this.validate((v: string) => {
      const baseRegex = `^[\\w-${accept}]*$`;
      const regex = new RegExp(baseRegex, 'g');
      return regex.test(v) ? undefined : errMsg;
    });

    return this;
  }

  email(errMsg: string = 'Email is not valid'): ValidatorString {
    this.validate((v: string) => (isEmail(v) ? undefined : errMsg));
    return this;
  }
}
