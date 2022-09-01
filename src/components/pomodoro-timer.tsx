import React, { useEffect } from 'react';
import { useInterval } from '../hooks/use-interval';
// import { secondsToMinutes } from '../utils/seconds-to-minutes';
import { secondsToTime } from '../utils/seconds-to-time';
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
  const [cyclesQttManager, setCyclesQttManager] = React.useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = React.useState(0);
  const [fullWorkingTime, setFullWorkingTime] = React.useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = React.useState(0);

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesQttManager.length > 0) {
      configureResting(false);
      cyclesQttManager.pop();
    } else if (working && cyclesQttManager.length <= 0) {
      configureResting(true);
      setCyclesQttManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    cyclesQttManager,
    mainTime,
    resting,
    completedCycles,
    numberOfPomodoros,
  ]);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
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
      <h2>Você está {working ? 'trabalhando!' : 'descansando'}</h2>
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
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
