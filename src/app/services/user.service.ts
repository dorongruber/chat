import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { User } from "../shared/models/user";
import { BaseService } from "./base/base.service";

const DEV_URI = 'http://localhost:3000/api/user/';
const PROD_URI = 'https://pacific-sierra-73043.herokuapp.com/api/user/';
const URI = window.location.hostname === 'localhost'? DEV_URI: PROD_URI;
const EmptyFile = new File([],'emptyFile');
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private defaultUser = new User('','','','','', EmptyFile);
  onUserChange = new BehaviorSubject<User>(this.defaultUser);
  constructor(
    private baseService: BaseService
    ) {}

  getUserById(id: string) {

    return this.baseService.get<
    {id: string, name: string, phone: string,
      password: string, email: string, img: File}
    >(URI,id)
    .then(user => {
      const img = Object.values(user.img)[0] ? user.img : EmptyFile;
      const currentUser = new User(
        user.id,
        user.name,
        user.phone,
        user.password,
        user.email,
        img,
      );
      this.onUserChange.next(currentUser);
      return currentUser;
    })
    .catch(err => err);
  }

  async getAllUsers() {
    const newURI = `${URI}allUsers`;
    return this.baseService
    .get<{id: string, name: string, phone: string,
      password: string, email: string, img: File}[]
    >(newURI,'')
    .then(users => {
      const formatUsers: User[] = [];
      users.forEach(u => {
        formatUsers.push(new User(u.id,u.name,u.phone,u.password,u.email,u.img))
      })
      return formatUsers;
    })
  }

  updateUser(updateduser: User) {

    const body = {
      id: updateduser.id,
      name: updateduser.name,
      phone: updateduser.phone,
      password: updateduser.password,
      email: updateduser.email,
      image: updateduser.img,
    }
    this.baseService.put<User>(URI,body)
    .then(resUpdatedUser => {
      const updatedUser = new User
      (resUpdatedUser.id,
        resUpdatedUser.name,
        resUpdatedUser.phone,
        resUpdatedUser.password,
        resUpdatedUser.email,
        resUpdatedUser.img)
      this.onUserChange.next(updatedUser);
    })
    .catch(err => {
      throw new Error(err)
    })
  }
}
