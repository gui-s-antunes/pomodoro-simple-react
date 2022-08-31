import React from 'react';
import { useInterval } from '../hooks/use-interval';
// import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

interface Props {
  PomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.PomodoroTimer);

  useInterval(() => {
    setMainTime(mainTime - 1);
  }, 1000);

  return (
    <div className="pomodoro">
      <h2>Your are: working</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Texto" onClick={() => console.log('hehe boi')}></Button>
        <Button text="Texto" onClick={() => console.log('hehe boi')}></Button>
        <Button text="Texto" onClick={() => console.log('hehe boi')}></Button>
      </div>

      <div className="details">
        <p>Testando: situações da app</p>
        <p>Testando: situações da app</p>
        <p>Testando: situações da app</p>
        <p>Testando: situações da app</p>
      </div>
    </div>
  );
}
