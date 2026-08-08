import type{CancellationCheckResult} from "../forms/cancellationPolicy"
const minimum_notice_minutes=120;

export function isCancellationAllowed(startTime: Date): CancellationCheckResult {
  const now = new Date();
  const minutesUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60);

  if (minutesUntilStart < minimum_notice_minutes) {
    return {
      allowed: false,
      reason: `Cannot cancel within ${minimum_notice_minutes} minutes of the booking's start time. Only ${Math.floor(minutesUntilStart)} minutes remain.`,
    };
  }

  return { allowed: true };
}