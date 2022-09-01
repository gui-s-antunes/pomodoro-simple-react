import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer
        PomodoroTimer={10}
        shortRestTime={3}
        longRestTime={15}
        cycles={4}
      />
    </div>
  );
}

export default App;
