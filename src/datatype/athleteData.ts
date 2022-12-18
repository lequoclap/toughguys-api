export declare interface Athelete {
    id: string,
    name: string,
    imgURL: string,
    activities: Activity[],
    accessToken: string,
    refreshToken: string,

}


export declare interface Activity {
    id: string,
    start: number,
    end: number,
    distance: number
}