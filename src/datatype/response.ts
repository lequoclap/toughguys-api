import { ResponseStatus, SportType } from "src/enum";

export declare interface GetDashboardResponse {

    code: number,
    success: ResponseStatus,
    data:
    {
        athlete: {
            id: string,
            name: string,
        },
        activities: {
            id: string,
            distance: number,
            type: SportType
        }[],
    }[]
}