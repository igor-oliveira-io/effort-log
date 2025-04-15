// components/ui/Timer.tsx
import CountUp from "react-countup";

interface TimerProps {
  seconds: number;
}

export default function Timer({ seconds }: TimerProps) {
  return (
    <div className="text-2xl font-bold text-blue-600 font-mono">
      <CountUp
        end={seconds}
        duration={0}
        useEasing={false}
        formattingFn={(val: number) => {
          const hrs = Math.floor(val / 3600)
            .toString()
            .padStart(2, "0");
          const mins = Math.floor((val % 3600) / 60)
            .toString()
            .padStart(2, "0");
          const secs = Math.floor(val % 60)
            .toString()
            .padStart(2, "0");
          return `${hrs}:${mins}:${secs}`;
        }}
      />
    </div>
  );
}
