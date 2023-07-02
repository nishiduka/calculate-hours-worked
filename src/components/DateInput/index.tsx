import { useState, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';

import './styles.css';
import InputMasked from '../InputMasked';
import { calculateHours } from '../../utils/dates';

type TDateInput = {
  index: number;
};
const DateInput = ({ index }: TDateInput) => {
  const { watch, setValue } = useFormContext();

  const quantityHours = watch(`quantityHoursPerDay`);

  const initHour = watch(`hours.${index}.initHour`);
  const initLunchHour = watch(`hours.${index}.initLunchHour`);
  const endLunchHour = watch(`hours.${index}.endLunchHour`);
  const endHour = watch(`hours.${index}.endHour`);

  const [totalExtra, setTotalExtra] = useState('00:00');
  const [total, setTotal] = useState('00:00');

  useEffect(() => {
    const { total, totalExtra } = calculateHours({
      maxHoursPerDay: quantityHours,
      initHour,
      initLunchHour,
      endLunchHour,
      endHour,
    });

    setTotal(total);
    setTotalExtra(totalExtra);

    setValue(`hours.${index}.totalExtra`, totalExtra);
    setValue(`hours.${index}.total`, total);
  }, [
    quantityHours,
    initHour,
    initLunchHour,
    endLunchHour,
    endHour,
    setValue,
    index,
  ]);

  const hoursAtDay = useMemo(() => {
    const maxQuantity = moment(quantityHours, 'HH:mm');
    const diff = moment(total, 'HH:mm').diff(maxQuantity, 'hours');

    if (diff < 0) {
      return 'text-danger';
    }
    if (diff > 0) {
      return 'text-warning';
    }

    return '';
  }, [quantityHours, total]);

  return (
    <div className="grid">
      <input type="hidden" name={`hours.${index}.totalExtra`} />
      <input type="hidden" name={`hours.${index}.total`} />

      <InputMasked name={`hours.${index}.initHour`} />

      <InputMasked name={`hours.${index}.initLunchHour`} />

      <InputMasked name={`hours.${index}.endLunchHour`} />

      <InputMasked name={`hours.${index}.endHour`} />

      <p className={`total-hours ${hoursAtDay}`}>{total}</p>
      <p className="total-hours-extra">{totalExtra}</p>
    </div>
  );
};

export default DateInput;
