# toughguys-api

The API only for tough guys. j/k

Just a tool to fetch data from Strava and customize.



## How to run in local


- install aws-cli, update credentials
- clone `env.ts.sample` to `env.ts`, update application information
- `npm install` or `yarn install`
- `npm run start`
- APIs will be run in http://localhost:3000 by default


## DynamoDB's structure

```
{
    id: "1234321", //key
    lastFetch: "2022-11-11 18:05:06",
    contents: {
            accessToken: "23qwd13142f3423rwer23523r23423r23r",
            refreshToken: "23qwd13142f3423rwer23523r23423r23rasdasq3423",
            expiresAt: "2022-11-11 12:12:12",
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



## API

### Generate token (register)

> Get accessToken and athlete id by Strava authentication code

```
endpoint: POST /generateToken

```
```
request:
{
    code: '123se23d213rf343f121341r3df'
}

```
```
response: 
{
    "status": "success",
    "data": {
        "athleteId": "12324123",
        "token": "97f5fb168437a0474f2ce777d3f0680f39043de6"
    }
}

```

### Sync data

> Fetch new data from Strava

```
endpoint: POST /syncData

```
```
headers:

Authorization: Bearer {{id}}.{{token}}

ex) Authorization: "1231231.97f5fb168437a0474f2ce777d3f0680f39043de6"

```
```
request:{ }
```
```
response: 
{
    "message": "Data has been synced"
}
```

### Get Dashboard Data

> Get newest dashboard data

```
endpoint: POST /dashboard

```

```
headers:

Authorization: Bearer {{id}}.{{token}}

ex) Authorization: "1231231.97f5fb168437a0474f2ce777d3f0680f39043de6"

```

```
request:
{
    from: "2022-10-11"
}

```
```
response: 
{
    "status": "success",
    "data": [
        {
            "athlete": {
                "id": "74221241",
                "name": "Lập Lê"
            },
            "activities": [
                {
                    "sportType": "Ride",
                    "distance": 11762
                },
                {
                    "sportType": "Run",
                    "distance": 37030
                },
                {
                    "sportType": "Walk",
                    "distance": 1609
                }
            ]
        }
    ]
}

```