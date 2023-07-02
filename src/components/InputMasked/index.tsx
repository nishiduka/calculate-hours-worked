import { useFormContext } from 'react-hook-form';
import InputMask from 'react-input-mask';

type TInputMasked = {
  name: string;
};
const InputMasked = ({ name }: TInputMasked) => {
  const { register } = useFormContext();

  const formatChars = {
    2: '[0-2]',
    5: '[0-5]',
    9: '[0-9]',
  };

  const mask = '29:59';

  return (
    <InputMask
      maskChar={'0'}
      type="tel"
      formatChars={formatChars}
      mask={mask}
      className="form-control"
      {...register(name)}
    />
  );
};

export default InputMasked;
