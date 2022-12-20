import * as AWS from "aws-sdk";
import axios from "axios";
import { config } from "src/config";
import { Activity } from "src/datatype/athleteData";
import { SportType } from "src/enum";


export class StravaAPICaller {

    /**
 *constructor
 */
    constructor() {
        AWS.config.update({ region: config.aws.region });
    }


    // refresh token
    public async getNewAccessToken(refreshToken: string): Promise<{
        accessToken: string,
        expiresAt: number,
    }> {
        //
        const url = config.strava.host + '/oauth/token';
        console.log('URL here:' + url);
        const bodyParameters = {
            client_id: config.strava.clientId,
            client_secret: config.strava.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };
        try {
            const res = await axios.post(url, bodyParameters);
            return {
                accessToken: res.data.access_token,
                expiresAt: res.data.expires_at
            }
        } catch (error) {
            const {
                status,
                statusText
            } = error.response;
            console.log(`Error! HTTP Status: ${status} ${statusText}`);
        }

    }

    // get Athlete  
    async getAthleteActivities(accessToken: string, after: number): Promise<Activity[]> {

        //paging + from + to

        const url = config.strava.host + '/athlete/activities?after=' + after;
        console.log(url)
        const axiosConfig = {
            headers: { Authorization: `Bearer ${accessToken}` }
        };

        try {
            const res = await axios.get(url, axiosConfig);
            const items = res.data;

            // console.log("rawdata", res.data)
            const activities: Activity[] = [];

            for (const item of items) {
                activities.push({
                    distance: item['distance'],
                    sportType: item['sport_type'] as SportType,
                    id: item['id'],
                    startDate: item['start_date'],
                    movingTime: item['moving_time']
                })
            }
            return activities;
        } catch (error) {
            const {
                status,
                statusText
            } = error.response;
            console.log(`Error! HTTP Status: ${status} ${statusText}`);
        }
    }




}