import React, { useEffect } from 'react';
import { useInterval } from '../hooks/use-interval';
// import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/Camcom.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/Red-Luigi-Course-Clear Fanfare.mp3');

const audioStartWorking = new Audio(bellStart);
const audioFinishWorking = new Audio(bellFinish);

interface Props {
  PomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.PomodoroTimer);
  const [timeCounting, setTimeCounting] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
  });

  useInterval(
    () => {
      setMainTime(mainTime - 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = () => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.PomodoroTimer);
    audioStartWorking.play();
  };

  const configureResting = (long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    if (!long) {
      setMainTime(props.shortRestTime);
    } else {
      setMainTime(props.longRestTime);
    }

    audioFinishWorking.play();
  };

  // const pauseWork = () => {
  //   if (working) {
  //     setTimeCounting(false);
  //     setWorking(false);
  //   }
  // };

  return (
    <div className="pomodoro">
      <h2>Your are: working</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureResting(false)}></Button>
        <Button
          className={resting && !working ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Resume'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
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
