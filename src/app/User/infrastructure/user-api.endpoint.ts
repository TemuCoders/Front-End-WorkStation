import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {UserResponse,UserResource} from './resources';
import {User} from '../domain/model/user.entity';
import {UserAssembler} from './user.assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment'


export class UserApiEndpoint extends BaseApiEndpoint<User,UserResource,UserResponse,UserAssembler>{
  constructor(http: HttpClient) {
    // ANTES: `${environment.apiBaseUrl}/bookings`
    super(http, `${environment.platformProviderApiBaseUrl}/users`, new UserAssembler());
  }
}
