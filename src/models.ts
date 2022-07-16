import {APIGatewayEvent} from 'aws-lambda';

export interface HandlerEvent extends APIGatewayEvent {
  url: string;
}
