# toughguys-api

The API only for tough guys. j/k

Just a tool to fetch data from Strava and customize as I want.

DynamoDB's structure

```
{
    id: "1234321", //key
    lastFetch: "2022-11-11 18:05:06",
    contents: {
            accessToken: "23qwd13142f3423rwer23523r23423r23r",
            refreshToken: "23qwd13142f3423rwer23523r23423r23rasdasq3423",
            expiresAt: string,
            athlete: {
                    id: "1234321",
                    name: "Jones",
                    imgURL: "https://example.com/jones.png",
                    activities: [
                        {
                            id: "12312412241312546312",
                            startDate: "2022-11-11 12:12:12",
                            movingTime: 5600,
                            distance: 6000,
                            sportType: "Run"
                        },
                        {
                            id: "12312412241312546313",
                            startDate: "2022-11-12 12:12:12",
                            movingTime: 5600,
                            distance: 6000,
                            sportType: "Hike"
                        },
                           
                    ]
            },
            
    }

}

```