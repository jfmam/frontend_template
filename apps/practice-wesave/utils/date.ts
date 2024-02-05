import { differenceInMilliseconds, startOfTomorrow } from "date-fns"

export const calcRemainingTimeUntilTomorrow = (currentTime: Date) => {
    const tomorrow = startOfTomorrow();

    return  differenceInMilliseconds(tomorrow, currentTime)
} 