import { DeletechatComponent } from "../components/deletechat/deletechat.component";
import { UserinfoComponent } from "../components/userinfo/userinfo.component";
import { DynamicComponentRef } from "../directives/dynamic-component.ref.directive";
import { HeaderMenuOption } from "../models/header-menu-option";
import { NewchatComponent } from "../routes/newchat/newchat.component";

export const chatMenuOptions = [
  new HeaderMenuOption('chat info', 'info', '/main/chatinfo', new DynamicComponentRef(NewchatComponent)),
  new HeaderMenuOption('exit chat', 'chevron_right','auth'),
];
export const mainMenuOptions = [
  new HeaderMenuOption('create chat', 'add_circle_outline', '/main/new',  new DynamicComponentRef(NewchatComponent)),
  new HeaderMenuOption('remove chat', 'remove_circle_outline', '/main/delete', new DynamicComponentRef(DeletechatComponent)),
  new HeaderMenuOption('user info', 'info', '/main/userinfo', new DynamicComponentRef(UserinfoComponent)),
  new HeaderMenuOption('exit app', 'exit_to_app','auth'),
];
