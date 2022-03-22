import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "../shared/models/user";
import { BaseService } from "./base/base.service";

const URI = 'http://localhost:3000/api/user/';
//const URI = 'http://10.100.102.8:3000/api/user/';
const EmptyFile = new File([],'emptyFile');
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;
  onUserChange = new Subject<User>();
  constructor(
    private baseService: BaseService
    ) {
    this.user = new User('','','','','', EmptyFile);
  }

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
      )
      this.set(currentUser);
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
    const formData = new FormData();

    formData.append('id', updateduser.id);
    formData.append('name', updateduser.name);
    formData.append('phone',  updateduser.phone);
    formData.append('password', updateduser.password);
    formData.append('email', updateduser.email);
    formData.append('image', updateduser.img);

    const url =`${URI}update/`
    this.baseService.put<any>(URI,formData)
    .then(resUpdatedUser => {
      const updatedUser = new User
      (resUpdatedUser.id,
        resUpdatedUser.name,
        resUpdatedUser.phone,
        resUpdatedUser.password,
        resUpdatedUser.email,
        resUpdatedUser.img)
      this.set(updatedUser);
      this.onUserChange.next(updatedUser);
    })
    .catch(err => {
      throw new Error(err)
    })
  }

  set(selectedUser: User) {
    this.user = selectedUser;
  }

  get() {
    return this.user;
  }
}
