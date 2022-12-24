import { SportType } from "src/enum";

export declare interface Athelete {
    id: string,
    name: string,
    imgURL: string,
    activities: Activity[],
}


export declare interface Activity {
    id: string,
    startDate: string,
    movingTime: number,
    distance: number,
    sportType: SportType
}