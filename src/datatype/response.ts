import { ResponseStatus, SportType } from "src/enum";

export declare interface GetDashboardResponse {
    status: ResponseStatus,
    data:
    {
        athlete: {
            id: string,
            name: string,
        },
        activities: {
            id: string,
            distance: number,
            sportType: SportType
        }[],
    }[]
}