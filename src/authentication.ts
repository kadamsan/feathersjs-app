import { Params, ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth, OAuthProfile, OAuthStrategy } from '@feathersjs/authentication-oauth';

import { Application } from './declarations';

declare module './declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}

class GitHubStrategy extends OAuthStrategy {
  async getEntityData(profile: OAuthProfile, existing: any, params: Params) {
    
    // this will set 'githubId'
    const baseData = await super.getEntityData(profile, existing, params);

    return {
      ...baseData,
      avatar: profile.avatar_url,
      email: profile.email
    };
  }
}

class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile: OAuthProfile, existing: any, params: Params) {
  
    // this will set 'googleId'
    const baseData = await super.getEntityData(profile, existing, params);
    
    // this will grab the picture and email address of the Google profile
    return {
      ...baseData,
      avatar: profile.picture,
      email: profile.email
    };
  }
}

export default function(app: Application): void {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('github', new GitHubStrategy());
  authentication.register('google', new GoogleStrategy());
  

  app.use('/authentication', authentication);
  app.configure(expressOauth());
}
