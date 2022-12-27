import * as AWS from "aws-sdk";
import axios from "axios";
import { config } from "src/config";
import { Activity, Athelete } from "src/datatype/athleteData";
import { SportType } from "src/enum";


export class StravaAPICaller {

    /**
 *constructor
 */
    constructor() {
        AWS.config.update({ region: config.aws.region });
    }


    // refresh token
    public async refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string,
        expiresAt: string,
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
                expiresAt: new Date(res.data.expires_at * 1000).toLocaleString()
            }
        } catch (error) {
            const {
                status,
                statusText
            } = error.response;
            console.log(`Error! HTTP Status: ${status} ${statusText}`);
        }

    }
    /**
     *  generate token from Code
     * @param code 
     * @returns 
     */
    public async generateTokenFromCode(code: string): Promise<{
        refreshToken: string,
        accessToken: string,
        expiresAt: string,
    }> {
        const url = config.strava.host + '/oauth/token';
        const bodyParameters = {
            client_id: config.strava.clientId,
            client_secret: config.strava.clientSecret,
            grant_type: 'authorization_code',
            code: code
        };

        console.debug(bodyParameters)
        try {
            const res = await axios.post(url, bodyParameters);
            return {
                refreshToken: res.data.refresh_token,
                accessToken: res.data.access_token,
                expiresAt: new Date(res.data.expires_at * 1000).toLocaleString()
            }
        } catch (error) {
            const {
                status,
                statusText
            } = error.response;
            console.log(`Error! HTTP Status: ${status} ${statusText}`);
        }

    }

    // get Athlete Activities
    async getAthlete(accessToken: string,): Promise<Athelete> {
        const url = config.strava.host + '/athlete';
        const axiosConfig = {
            headers: { Authorization: `Bearer ${accessToken}` }
        };
        try {
            const res = await axios.get(url, axiosConfig);
            return {
                id: res.data.id + '',
                name: res.data.firstname + " " + res.data.lastname,
                imgURL: res.data.profile,
                activities: []
            }

        } catch (error) {
            const {
                status,
                statusText
            } = error.response;
            console.log(`Error! HTTP Status: ${status} ${statusText}`);
        }
    }

    // get Athlete Activities
    async getAthleteActivities(accessToken: string, after: number): Promise<Activity[]> {

        //paging + from + to

        const activities: Activity[] = [];
        const perPage = 100;
        let loopFlg = true;
        let page = 1

        while (page < 5 && loopFlg) {

            const url = config.strava.host + '/athlete/activities'
                + '?per_page=' + perPage
                + '&after=' + after
                + '&page=' + page;
            page++;
            console.log(url)
            const axiosConfig = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };
            try {
                const res = await axios.get(url, axiosConfig);
                const items = res.data as [];
                if (items.length < perPage) loopFlg = false;
                for (const item of items) {
                    activities.push({
                        distance: item['distance'],
                        sportType: item['sport_type'] as SportType,
                        id: item['id'],
                        startDate: item['start_date'],
                        movingTime: item['moving_time']
                    })
                }

            } catch (error) {
                const {
                    status,
                    statusText
                } = error.response;
                console.log(`Error! HTTP Status: ${status} ${statusText}`);
            }
        }
        console.log(activities.length)
        return activities;
    }




}