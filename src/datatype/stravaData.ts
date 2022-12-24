import { SportType } from "src/enum";
import { Athelete } from "./athleteData";

export declare interface StravaData {
    id: string,
    lastFetch: string,
    contents: StravaDataContents

}


export declare interface StravaDataContents {
    athlete: Athelete;
    accessToken: string,
    refreshToken: string,
    expiresAt: string,
}

export declare interface SportWeight {
    sportType: SportType,
    weight: number
}

