import moment from 'moment';

export const formatHour = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
};

export const calculateDiffBetween = (end: string, start: string): string => {
  const dt1 = moment(end, 'HH:mm');
  const dt2 = moment(start, 'HH:mm');

  if (!dt1.isValid() || !dt2.isValid()) return '';

  const hours = dt2.diff(dt1, 'hours');
  const minutes = dt2.diff(dt1, 'minutes') % 60;

  if (hours < 0 || minutes < 0) {
    return '';
  }

  return formatHour(hours, minutes);
};

type TCalculateHours = {
  initLunchHour: string;
  endLunchHour: string;
  initHour: string;
  endHour: string;
  maxHoursPerDay: string;
};
export const calculateHours = ({
  initLunchHour,
  endLunchHour,
  initHour,
  endHour,
  maxHoursPerDay,
}: TCalculateHours): {
  total: string;
  totalExtra: string;
} => {
  if (!initHour || !endHour)
    return {
      total: '',
      totalExtra: '',
    };

  const lunchTime = calculateDiffBetween(initLunchHour, endLunchHour);
  const workTime = calculateDiffBetween(initHour, endHour);

  let total = calculateDiffBetween(lunchTime.toString(), workTime.toString());

  if (!lunchTime) {
    total = workTime;
  }

  let totalExtra = '';

  const extra = calculateDiffBetween(maxHoursPerDay, total);

  if (extra) {
    totalExtra = extra;
  }

  return {
    total,
    totalExtra,
  };
};
