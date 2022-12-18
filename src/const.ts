import { SportWeight } from "./datatype/stravaData";
import { SportType } from "./enum";

export const SPORT_WEIGHT: SportWeight[] = [
    {
        sportType: SportType.Ride,
        weight: 1
    },
    {
        sportType: SportType.Hike,
        weight: 5
    },
    {
        sportType: SportType.Run,
        weight: 3
    },
    {
        sportType: SportType.Swim,
        weight: 10
    },
]