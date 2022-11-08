import styles from './phone-input.module.scss';
import { useCallback } from 'react';
import classNames from 'classnames';
import PhoneInput2, {
  PhoneInputProps as PhoneInput2Props,
} from 'react-phone-input-2';

type PhoneInputProps = {
  value: PhoneInput2Props['value'];
  inputProps: PhoneInput2Props['inputProps'];
  inputClass: PhoneInput2Props['inputClass'];
  isInvalid: boolean;
  isValid: boolean;
  onChange: (phoneNumber: string) => void;
};

export function PhoneInput({
  value,
  inputProps,
  inputClass,
  isInvalid,
  isValid,
  onChange,
}: PhoneInputProps) {
  const handleOnChange = useCallback<PhoneInput2Props['onChange']>(
    (phoneNumber) => {
      // add "+" to phone number
      let formattedPhoneNumber = phoneNumber;
      if (phoneNumber?.length > 0 && !phoneNumber.startsWith('+')) {
        formattedPhoneNumber = `+${phoneNumber}`;
      }
      onChange(formattedPhoneNumber);
    },
    [onChange]
  );

  return (
    <PhoneInput2
      containerClass={styles.reactTelInput}
      enableSearch
      specialLabel=""
      country={'us'}
      value={value}
      placeholder=""
      inputProps={inputProps}
      inputClass={classNames(
        {
          'is-invalid': isInvalid,
          'is-valid': isValid,
        },
        inputClass
      )}
      onChange={handleOnChange}
    />
  );
}
