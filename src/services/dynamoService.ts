import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StravaData, StravaDataContents } from 'src/datatype/stravaData';
import { config } from '../config';


/**
 * DynamoDB DocumentClientの取得
 * @returns DocumentClient
 */
const getDynamoDocumentClient = async (): Promise<DocumentClient> => {
    const documentClient = new DynamoDB.DocumentClient({
        convertEmptyValues: true // 空文字の登録はNGのため自動的にNullに変換させる
    });
    return documentClient;
};

/**
 *
 * @param athleteId
 */
export async function getAthleteData(athleteId: string): Promise<StravaData> {
    const documentClient = await getDynamoDocumentClient();
    const params = {
        TableName: config.dyanmodb.tableName,
        Key: {
            id: athleteId
        }
    };
    return new Promise((resolve, reject) => {
        documentClient.get(params, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    })
        .then((data: DynamoDB.DocumentClient.GetItemOutput) => {
            const athleteData = data.Item as StravaData;
            if (athleteData) {
                return athleteData;
            }
            return null;
        })
        .catch((err) => {
            console.error(params);
            console.error('Unable to get athleteData ', 'id:', athleteId, err);
            return null;
        });
}

/**
 *
 * @param athleteId
 * @param contents
 */
export async function createOrUpdateStravaData(athleteId: string, contents: StravaDataContents, lastFetch: string): Promise<boolean> {
    const documentClient = await getDynamoDocumentClient();

    const params = {
        TableName: config.dyanmodb.tableName,
        Item: {
            id: athleteId,
            contents: contents,
            lastFetch
        }
    };


    return new Promise((resolve, reject) => {
        documentClient.put(params, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    })
        .then((_data) => {
            return true;
        })
        .catch((err) => {
            console.error('Unable to create data', err);
            return false;
        });
}


/**
 * 
 * @returns 
 */

export async function fetchAllData(): Promise<StravaData[]> {
    const documentClient = await getDynamoDocumentClient();
    const params = {
        TableName: config.dyanmodb.tableName
    };

    return new Promise((resolve, reject) => {
        documentClient.scan(params, (err, data) => {
            if (err) return reject(err);
            resolve(data.Items);
        });
    })
        .then((data) => {
            return data as StravaData[];
        })
        .catch((err) => {
            console.error('Unable to fetch all data', err);
            return [];
        });
}
