import { Button, Container, Card } from 'react-bootstrap';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import './App.css';
import DateInput from './components/DateInput';
import InputMasked from './components/InputMasked';
import { formatHour } from './utils/dates';

function App() {
  const methods = useForm({
    defaultValues: {
      hours: [
        {
          initHour: '00:00',
          initLunchHour: '00:00',
          endLunchHour: '00:00',
          endHour: '00:00',
          total: '00:00',
          totalExtra: '00:00',
        },
      ],
      quantityHoursPerDay: '08:00',
    },
  });

  const { fields, append } = useFieldArray({
    control: methods.control,
    name: 'hours',
  });

  const hours = methods.watch('hours');
  const hoursTotal = hours.map((item) => item.total);
  const hoursExtra = hours.map((item) => item.totalExtra);

  const addRowSum = () => {
    append({
      initHour: '00:00',
      initLunchHour: '00:00',
      endLunchHour: '00:00',
      endHour: '00:00',
      total: '00:00',
      totalExtra: '00:00',
    });
  };

  const quantity = methods.watch('quantityHoursPerDay');

  const calculate = (schedule: string[]) => {
    return schedule.reduce((acc, current) => {
      const [hourAcc, minuteAcc] = acc.split(':');
      const hourCurr = current.split(':');

      if (parseInt(hourCurr[0]) > parseInt(quantity)) {
        hourCurr[0] = quantity;
      }

      let hour = parseInt(hourCurr[0]) + parseInt(hourAcc);
      let minute = parseInt(hourCurr[1]) + parseInt(minuteAcc);

      if (isNaN(hour) || isNaN(minute)) {
        return acc;
      }

      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute = minute % 60;
      }

      return formatHour(hour, minute);
    }, '00:00');
  };

  return (
    <div className="content">
      <Container>
        <Card>
          <Card.Body>
            <Card.Title>Calculadora de Horas</Card.Title>
            <hr />
            <FormProvider {...methods}>
              <div className="wrapQuantity">
                <p className="mb-0">São quantas horas por dia?</p>
                <InputMasked name={`quantityHoursPerDay`} />
              </div>

              <div className="grid">
                <p>Entrada</p>
                <p>Inicio almoco</p>
                <p>Volta do almoco</p>
                <p>Saida</p>
                <p className="total-hours">Total</p>
                <p className="total-hours-extra">Horas Extras</p>
              </div>

              {fields.map((field, index) => (
                <DateInput
                  key={field.id}
                  index={index}
                  addRowSum={addRowSum}
                  isLast={fields.length === index + 1}
                />
              ))}

              <hr />
              <div className="d-flex justify-content-center mt-4">
                <Button onClick={addRowSum}>+</Button>
              </div>

              <hr />
              <p>Total trabalhado: {calculate(hoursTotal)}</p>
              <p>Total horas extras: {calculate(hoursExtra)}</p>
            </FormProvider>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;
