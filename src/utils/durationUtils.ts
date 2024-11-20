// utils/durationUtils.ts
import type { DurationConfig } from '@/types/business';

export const generateDurationOptions = (config: DurationConfig) => {
  const options = [];
  for (let mins = config.minDuration; mins <= config.maxDuration; mins += config.interval) {
    const hours = mins / 60;
    options.push({
      value: hours.toString(),
      label: hours === 1 ? "1 hour" :
             hours < 1 ? `${mins} minutes` :
             `${hours} hours`
    });
  }
  return options;
};