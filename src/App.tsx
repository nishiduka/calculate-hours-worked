import { useState } from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import moment from 'moment';

import './App.css';
import DateInput from './components/DateInput';

function App() {
  const [quantityHours, setQuantityHours] = useState<string[]>(['00:00']);
  const [quantityHoursExtra, setQuantityHoursExtra] = useState<string[]>([
    '00:00',
  ]);

  const setTotalHoursinDay = (index: number, hours: string) => {
    setQuantityHours((value) => {
      value[index] = hours;

      return value;
    });
  };

  const setTotalHoursExtrainDay = (index: number, hours: string) => {
    setQuantityHoursExtra((value) => {
      value[index] = hours;

      return value;
    });
  };

  const addRowSum = () => {
    setQuantityHoursExtra((value) => [...value, '00:00']);
    setQuantityHours((value) => [...value, '00:00']);
  };

  const calculate = (rows: string[]) => {
    return rows.reduce((acc, current) => {
      const [hour, minute] = current.split(':');
      const total = moment(acc, 'HH:mm');
      total.add(hour, 'hours');
      total.add(minute, 'minutes');

      return `${total.hours().toString().padStart(2, '0')}:${total
        .minutes()
        .toString()
        .padStart(2, '0')}`;
    }, '00:00');
  };

  return (
    <div className="content">
      <Container>
        <Card>
          <Card.Body>
            <Card.Title>Calculadora de Horas</Card.Title>
            <hr />

            <div className="grid">
              <p>Entrada</p>
              <p>Inicio almoco</p>
              <p>Volta do almoco</p>
              <p>Saida</p>
              <p className="total-hours">Total</p>
              <p className="total-hours-extra">Horas Extras</p>
            </div>

            {quantityHours.map((_, index) => (
              <DateInput
                key={index}
                setTotalHoursExtra={(value) =>
                  setTotalHoursExtrainDay(index, value)
                }
                setTotal={(value) => setTotalHoursinDay(index, value)}
              />
            ))}

            <hr />
            <div className="d-flex justify-content-center mt-4">
              <Button onClick={addRowSum}>+</Button>
            </div>

            <hr />
            <p>Total trabalhado: {calculate(quantityHours)}</p>
            <p>Total horas extras: {calculate(quantityHoursExtra)}</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;
