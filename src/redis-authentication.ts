import { AuthenticationService, AuthenticationResult, AuthenticationRequest } from '@feathersjs/authentication';
import { Application } from './declarations';
import { Params } from '@feathersjs/feathers';
import { NotAuthenticated } from '@feathersjs/errors';

export class RedisAuthenticationService extends AuthenticationService {
  redisClient: any;
  app: Application;
  constructor(app: Application, configKey?: string) {
    super(app, configKey);
    this.app = app;
  }

  async getPayload(authResult: AuthenticationResult, params: Params) {
    const payload = await super.getPayload(authResult, params);
    const { fe_user } = authResult;
    const fullname = `${fe_user.first_name} ${fe_user.last_name}`;
    return {
      ...payload,
      fullname
    };
  }

  async revokeAccessToken(accessToken: any) {
    this.redisClient = await this.getRedisClient();
    // First make sure the access token is valid
    const verified = await this.verifyAccessToken(accessToken);
    // Calculate the remaining valid time for the token (in seconds)
    const expiry = verified.exp - Math.floor(Date.now() / 1000);
    // Add the revoked token to Redis and set expiration
    await this.redisClient.set(accessToken, 'true');
    await this.redisClient.expire(accessToken, expiry);
    return verified;
  }

  async getRedisClient() {        
    return (this.redisClient) ? this.redisClient : this.app.get('redisClient') ;
  }

  async verifyAccessToken(accessToken: any) {
    this.redisClient = await this.getRedisClient();
    if (await this.redisClient.exists(accessToken)) {
      throw new NotAuthenticated('Token revoked');
    }
    return super.verifyAccessToken(accessToken);
  }

  async create(data: AuthenticationRequest, params: Params) {
    const authResult = await super.create(data, params);
    return authResult;
  }

  async remove(id: string, params: Params) {
    const authResult = await super.remove(id, params);
    const { accessToken } = authResult;
    if (accessToken) {
      // If there is an access token, revoke it
      await this.revokeAccessToken(accessToken);
    }
    return authResult;
  }
}
