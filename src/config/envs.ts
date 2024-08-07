
import 'dotenv/config'
import * as joi from 'joi';

interface EnvVars {
  PORT : number;
  NATS_SERVERS:string[];

  // PRODUCTS_MICROSERVICE_HOST : string;
  // PRODUCTS_MICROSERVICE_PORT : number;

  // ORDERS_MICROSERVICE_HOST : string;
  // ORDERS_MICROSERVICE_PORT : number;
}

const envsSchema = joi.object({
  PORT : joi.number().required(),
  NATS_SERVERS:joi.array().items( joi.string() ).required()

  // PRODUCTS_MICROSERVICE_HOST : joi.string().required(),
  // PRODUCTS_MICROSERVICE_PORT : joi.number().required(),
  // ORDERS_MICROSERVICE_HOST : joi.string().required(),
  // ORDERS_MICROSERVICE_PORT : joi.number().required(),

}).unknown(true)

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(',')
});

if(error) throw new Error(`Config validation error:  ${error}`)

const envVars : EnvVars = value;

export const envs = {

  port : envVars.PORT,
  nats_servers : envVars.NATS_SERVERS

  // products_microservice_host : envVars.PRODUCTS_MICROSERVICE_HOST,
  // products_microservice_port : envVars.PRODUCTS_MICROSERVICE_PORT,

  // orders_microservice_host : envVars.ORDERS_MICROSERVICE_HOST,
  // orders_microservice_port : envVars.ORDERS_MICROSERVICE_PORT,

}