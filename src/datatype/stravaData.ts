import { SportType } from "src/enum";
import { Athelete } from "./athleteData";

export declare interface StravaData {
    id: string,
    contents: StravaDataContents

}


export declare interface StravaDataContents {

    athlete: Athelete;

}

export declare interface SportWeight {
    sportType: SportType,
    weight: number
}

