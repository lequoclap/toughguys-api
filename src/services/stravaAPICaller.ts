import * as AWS from "aws-sdk";
import axios from "axios";
import { config } from "src/config";


export class stravaAPICaller {

    /**
 *constructor
 */
    constructor() {
        AWS.config.update({ region: config.aws.region });
    }


    // refresh token
    async refreshAccessToken(refreshToken: string): Promise<any> {
        //
        const url = config.strava.host + '/athlete/activities';

        const bodyParameters = {
            client_id: config.strava.clientId,
            client_secret: config.strava.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };
        try {
            const res = await axios.post(url, bodyParameters);
            const items = res.data;
            for (const item of items) {
                console.log(`${item.user.id}: \t${item.title}`);
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
    async getAthleteActivities(accessToken: string, from: string): Promise<any> {

        //paging + from + to

        const url = config.strava.host + '/athlete/activities?from=' + from;
        const axiosConfig = {
            headers: { Authorization: `Bearer ${accessToken}` }
        };

        try {
            const res = await axios.get(url, axiosConfig);
            const items = res.data;
            for (const item of items) {
                console.log(`${item.user.id}: \t${item.title}`);
            }
        } catch (error) {
            const {
                status,
                statusText
            } = error.response;
            console.log(`Error! HTTP Status: ${status} ${statusText}`);
        }
    }




}