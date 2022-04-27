
import AWS from 'aws-sdk';
import { IResponse } from '../interfaces';

export class DynamoDBService {

    public async getAllWorkshops(): Promise<IResponse.WorkshopResponse[]> {
        try {
            const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
                apiVersion: '2012-08-10'
            });
            const params: AWS.DynamoDB.DocumentClient.ScanInput = {
                TableName: 'AWB_WORKSHOP_STORE_DATA'
            };
            const response = await dynamoDbClient.scan(params).promise();
            return response.Items as IResponse.WorkshopResponse[];
        } catch (error) {
            return [];
        }
    }

    public async getWorkshopsBySpeakerId(speakerId: string): Promise<IResponse.WorkshopResponse[]> {
        try {
            const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
                apiVersion: '2012-08-10'
            });
            const params: AWS.DynamoDB.DocumentClient.QueryInput = {
                TableName: 'AWB_WORKSHOP_STORE_DATA',
                KeyConditionExpression: '#speakerId = :speakerId',
                ExpressionAttributeNames: {
                    '#speakerId': 'speakerId'
                },
                ExpressionAttributeValues: {
                    ':speakerId': speakerId
                },
                ReturnConsumedCapacity: 'TOTAL'
            }
            const dynamoDbResponse = await dynamoDbClient.query(params).promise();
            return dynamoDbResponse.Items as IResponse.WorkshopResponse[];

        } catch (error) {
            return [];
        }
    }

    public async getWorkshopsBySpeakerIdAndWorkshopId(speakerId: string, workshopId: string): Promise<IResponse.WorkshopResponse> {
        try {
            const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
                apiVersion: '2012-08-10'
            });
            const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
                TableName: 'AWB_WORKSHOP_STORE_DATA',
                Key: {
                    workshopId: workshopId,
                    speakerId: speakerId
                },
                ReturnConsumedCapacity: 'TOTAL'
            }
            const dynamoDbResponse = await dynamoDbClient.get(params).promise();
            return dynamoDbResponse.Item as IResponse.WorkshopResponse;

        } catch (error) {
            return {} as IResponse.WorkshopResponse;
        }
    }

    public async putWorkshop(workshop: IResponse.WorkshopResponse): Promise<IResponse.MessageResponse> {
        try {
            const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
                apiVersion: '2012-08-10'
            });
            const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
                TableName: 'AWB_WORKSHOP_STORE_DATA',
                Item: workshop,
                ReturnConsumedCapacity: 'TOTAL'
            }
            await dynamoDbClient.put(params).promise();
            return {
                message: 'success'
            }

        } catch (error) {
            return {
                message: 'error'
            }
        }
    }

    public async deleteWorkshop(workshopId: string, speakerId: string): Promise<IResponse.MessageResponse> {
        try {
            const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
                apiVersion: '2012-08-10'
            });
            const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
                TableName: 'AWB_WORKSHOP_STORE_DATA',
                Key: {
                    workshopId: workshopId,
                    speakerId: speakerId
                },
                ReturnConsumedCapacity: 'TOTAL'
            }
            await dynamoDbClient.delete(params).promise();
            return {
                message: 'success'
            }

        } catch (error) {
            return {
                message: 'error'
            }
        }
    }
}