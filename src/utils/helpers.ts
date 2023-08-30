import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const calculateRemainingTime = (time: string) => {
  const now = new Date();
  const targetTime = new Date(time);
  const timeDifference = targetTime.getTime() - now.getTime();
  if (timeDifference <= 0) {
    return `Start Spaces`;
  }
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
  );

  let result = "Starts in ";
  if (hours > 0) {
    result += `${hours} hour `;
  }

  if (minutes > 0) {
    result += `${minutes} minutes`;
  }

  if (hours === 0 && minutes === 0) {
    result = `Start Spaces`;
  }

  return result;
};

