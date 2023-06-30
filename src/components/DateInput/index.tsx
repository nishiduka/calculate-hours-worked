import { useState, useEffect, useCallback } from 'react';
import InputMask from 'react-input-mask';
import moment from 'moment';

import './styles.css';

type TDateInput = {
  setTotal: (value: string) => void;
  setTotalHoursExtra: (value: string) => void;
};
const DateInput = ({
  setTotal: setAllHours,
  setTotalHoursExtra,
}: TDateInput) => {
  const [initHour, setInitHour] = useState('');
  const [initLunchHour, setInitLunchHour] = useState('');
  const [endLunchHour, setEndLunchHour] = useState('');
  const [endHour, setEndHour] = useState('');

  const [totalExtra, setTotalExtra] = useState('00:00');
  const [total, setTotal] = useState('00:00');

  const calculateDiffBetween = useCallback(
    (end: string, start: string): string => {
      const dt1 = moment(end, 'HH:mm');
      const dt2 = moment(start, 'HH:mm');

      if (!dt1.isValid() || !dt2.isValid()) return '';

      const hours = dt2.diff(dt1, 'hours');
      const minutes = dt2.diff(dt1, 'minutes') % 60;

      if (hours < 0 || minutes < 0) {
        return '00:00';
      }

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
    },
    []
  );

  const calculateHours = useCallback(() => {
    if (!initHour || !endHour) return;

    const lunchTime = calculateDiffBetween(initLunchHour, endLunchHour);
    const workTime = calculateDiffBetween(initHour, endHour);

    let totalHours = calculateDiffBetween(
      lunchTime.toString(),
      workTime.toString()
    );

    if (!lunchTime) {
      totalHours = workTime;
    }

    if (!totalHours) {
      setTotal('');
    }
    setTotal(totalHours.toString());

    const extra = calculateDiffBetween('08:00', totalHours);
    let hours = totalHours.toString();

    if (extra) {
      setTotalHoursExtra(extra);
      setTotalExtra(extra);
      hours = '08:00';
    }

    setAllHours(hours);
  }, [
    initHour,
    endHour,
    calculateDiffBetween,
    initLunchHour,
    endLunchHour,
    setAllHours,
    setTotalHoursExtra,
  ]);

  useEffect(() => {
    calculateHours();
  }, [calculateHours]);

  const formatChars = {
    2: '[0-2]',
    5: '[0-5]',
    9: '[0-9]',
  };

  const mask = '29:59';

  return (
    <div className="grid">
      <InputMask
        type="tel"
        formatChars={formatChars}
        mask={mask}
        className="form-control"
        value={initHour}
        onChange={(e) => setInitHour(e.target.value)}
      />
      <InputMask
        type="tel"
        formatChars={formatChars}
        mask={mask}
        className="form-control"
        value={initLunchHour}
        onChange={(e) => setInitLunchHour(e.target.value)}
      />
      <InputMask
        type="tel"
        formatChars={formatChars}
        mask={mask}
        className="form-control"
        value={endLunchHour}
        onChange={(e) => setEndLunchHour(e.target.value)}
      />
      <InputMask
        type="tel"
        formatChars={formatChars}
        mask={mask}
        className="form-control"
        value={endHour}
        onChange={(e) => setEndHour(e.target.value)}
      />

      <p className="total-hours">{total}</p>
      <p className="total-hours-extra">{totalExtra}</p>
    </div>
  );
};

export default DateInput;
