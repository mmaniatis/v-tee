import type { DurationConfig } from '@/types/business';

export function generateDurationOptions(config: DurationConfig): Array<{ value: string; label: string }> {
  const options: Array<{ value: string; label: string }> = [];
  let duration = config.minDuration;

  while (duration <= config.maxDuration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    let label = '';

    if (hours > 0) {
      label += `${hours} hour${hours > 1 ? 's' : ''}`;
      if (minutes > 0) label += ' ';
    }
    if (minutes > 0) {
      label += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    options.push({
      value: duration.toString(),
      label
    });

    duration += config.interval;
  }

  return options;
}