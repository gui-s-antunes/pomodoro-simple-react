import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

import setAudio from '../utils/set-audio';

import { AudioProtocol } from '../interfaces/audio-protocol';
import { PomodoroTimerProps } from '../interfaces/pomodoro-timer-props';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/Camcom.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/Red-Luigi-Course-Clear.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinishLong = require('../sounds/Sanic-Act_Cleared.flac');

const audioOptions: AudioProtocol[] = [
  { value: 'Camcom.mp3', label: 'Capcom Theme' },
  { value: 'Red-Luigi-Course-Clear.mp3', label: 'Red Luigi Course Clear' },
  { value: 'Sanic-Act_Cleared.flac', label: 'Sanic Act Cleared' },
];

export function PomodoroTimer(props: PomodoroTimerProps): JSX.Element {
  const [mainTime, setMainTime] = useState(props.PomodoroTimer);
  const [timeStamp, setTimeStamp] = useState(Math.round(Date.now() / 1000));
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(true);
  const [cyclesQttManager, setCyclesQttManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  // const [selectedAudioStart, setSelectedAudioStart] = useState<
  //   SingleValue<AudioProtocol>
  // >(audioOptions[0]);
  // const [selectedAudioFinish, setSelectedAudioFinish] = useState<
  //   SingleValue<AudioProtocol>
  // >(audioOptions[0]);
  // const [selectedAudioFinishLong, setSelectedAudioFinishLong] = useState<
  //   SingleValue<AudioProtocol>
  // >(audioOptions[0]);

  const [audioFinishShort, setAudioFinishShort] = useState(
    new Audio(bellFinish),
  );
  const [audioFinishLong, setAudioFinishLong] = useState(
    new Audio(bellFinishLong),
  );
  const [audioStart, setAudioStart] = useState(new Audio(bellStart));

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

  useEffect(() => {
    setTimeStamp(Math.round(Date.now() / 1000));
  }, [timeCounting]);

  useInterval(
    () => {
      // att const com o timestamp a cada vez que passar aqui
      // e depois fazer a diferen??a entre o timestamp anterior e substituir pelo 1 nos dois abaixo
      // isso evita o delay que causa na p??gina e faz o useInterval se atrasar (muito)
      const timeDiff = Math.round(Date.now() / 1000) - timeStamp;
      setTimeStamp(Math.round(Date.now() / 1000));
      setMainTime(mainTime - timeDiff);
      if (working) setFullWorkingTime(fullWorkingTime + timeDiff);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = () => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.PomodoroTimer);
    audioStart.play();
  };

  const configureResting = (long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    if (!long) {
      setMainTime(props.shortRestTime);
      audioFinishShort.play();
    } else {
      setMainTime(props.longRestTime);
      audioFinishLong.play();
    }
  };

  const configureStartBell = (option: SingleValue<AudioProtocol>) => {
    // setSelectedAudioStart(option);
    if (option) setAudioStart(setAudio(option.value));
  };

  const configureFinishBell = (option: SingleValue<AudioProtocol>) => {
    // setSelectedAudioFinish(option);
    if (option) setAudioFinishShort(setAudio(option.value));
  };

  const configureFinishBellLong = (option: SingleValue<AudioProtocol>) => {
    // setSelectedAudioFinishLong(option);
    if (option) setAudioFinishLong(setAudio(option.value));
  };

  return (
    <div className="pomodoro">
      <h2>You are {working ? 'working!' : 'resting!'}</h2>
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
        <p>Finished Cycles: {completedCycles}</p>
        <p>Total of working hours: {secondsToTime(fullWorkingTime)}</p>
        <p>Finished Pomodoros: {numberOfPomodoros}</p>
      </div>

      <div className="configs">
        <p>Set a bell to Pomodoro Start:</p>
        <Select
          placeholder="Select a bell..."
          // value={selectedAudioStart}
          onChange={(option) => configureStartBell(option)}
          options={audioOptions}
        />
        <p>Set a bell to Pomodoro Finish:</p>
        <Select
          placeholder="Select a bell..."
          // value={selectedAudioFinish}
          options={audioOptions}
          onChange={(option) => configureFinishBell(option)}
        />
        <p>Set a bell to Cycle Finish:</p>
        <Select
          placeholder="Select a bell..."
          // value={selectedAudioFinishLong}
          options={audioOptions}
          onChange={(option) => configureFinishBellLong(option)}
        />
      </div>
    </div>
  );
}
