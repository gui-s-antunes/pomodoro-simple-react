import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/Camcom.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/Red-Luigi-Course-Clear.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinishLong = require('../sounds/Sanic-Act_Cleared.flac');

const audioStartWorking = new Audio(bellStart);
const audioFinishWorking = new Audio(bellFinish);
const audioFinishWorkingLong = new Audio(bellFinishLong);

interface OptionType {
  value: string;
  label: string;
}

const audioOptions: OptionType[] = [
  { value: 'Camcom.mp3', label: 'Capcom Theme' },
  { value: 'Red-Luigi-Course-Clear.mp3', label: 'Red Luigi Course Clear' },
  { value: 'Sanic-Act_Cleared.flac', label: 'Sanic Act Cleared' },
  { value: '', label: 'Custom Audio' },
];

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];

interface Props {
  PomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.PomodoroTimer);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQttManager, setCyclesQttManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  const [selectedAudioStart, setSelectedAudioStart] = useState<
    SingleValue<OptionType>
  >(audioOptions[0]);
  const [selectedAudioFinish, setSelectedAudioFinish] = useState<
    SingleValue<OptionType>
  >(audioOptions[0]);

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
      audioFinishWorking.play();
    } else {
      setMainTime(props.longRestTime);
      audioFinishWorkingLong.play();
    }
  };

  const configureFinishBell = (option: SingleValue<OptionType>) => {
    console.log(option);
    setSelectedAudioFinish(option);
  };

  const configureStartBell = (option: SingleValue<OptionType>) => {
    console.log(option);
    setSelectedAudioStart(option);
  };

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

      <div className="configs">
        <p>
          Som de início do Pomodoro{' '}
          {selectedAudioStart ? selectedAudioStart.value : ''}:
        </p>
        <Select
          value={selectedAudioStart}
          onChange={(option) => configureStartBell(option)}
          options={audioOptions}

          // onChange={(option) => configureStartBell(option)}
        />
        <p>Som de fim do Pomodoro:</p>
        <Select
          value={selectedAudioFinish}
          options={audioOptions}
          onChange={(option) => configureFinishBell(option)}
        />
      </div>
    </div>
  );
}
