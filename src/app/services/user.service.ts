import { Injectable } from "@angular/core";
import { User } from "../shared/models/user";
import { BaseService } from "./base/base.service";

const URI = 'http://localhost:3000/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;
  constructor(
    private baseService: BaseService
    ) {
    this.user = new User('','','','','');
  }

  getUserById(id: string) {

    return this.baseService.get<
    {id: string, name: string, phone: string,
      password: string, email: string}
    >(URI,id)
    .then(user => {
      console.log('user -> ', user);
      const currentUser = new User(
        user.id,
        user.name,
        user.phone,
        user.password,
        user.email,
      )
      this.set(currentUser);
      return currentUser;
    })
    .catch(err => err);
  }

  getAllUsers() {
    const newURI = `${URI}allUsers`;
    return this.baseService
    .get<{id: string, name: string, phone: string,
      password: string, email: string}[]
    >(newURI,'')
    .then(users => {
      //console.log('then all users -> ', users);
      const formatUsers: User[] = [];
      users.forEach(u => {
        formatUsers.push(new User(u.id,u.name,u.phone,u.password,u.email))
      })
      return formatUsers;
    })
  }

  set(selectedUser: User) {
    console.log('set user => ', selectedUser);
    this.user = selectedUser;
  }

  get() {
    return this.user;
  }
}
