import React from 'react';
import { useInterval } from '../hooks/use-interval';
// import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

interface Props {
  defaultPomodoroTimer: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.defaultPomodoroTimer);

  useInterval(() => {
    setMainTime(mainTime - 1);
  }, 1000);

  return (
    <div>
      <h2>Your are: working</h2>
      <Timer mainTime={mainTime} />
      <Button text="Texto" onClick={() => console.log('hehe boi')}></Button>
    </div>
  );
}
