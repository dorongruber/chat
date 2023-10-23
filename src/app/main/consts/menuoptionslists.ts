import { DeletechatComponent } from "../components/deletechat/deletechat.component";
import { GroupchatComponent } from "../routes/groupchat/groupchat.component";
import { UserinfoComponent } from "../routes/userinfo/userinfo.component";
import { DynamicComponentRef } from "../directives/dynamic-component.ref.directive";
import { HeaderMenuOption } from "../models/header-menu-option";
import { NewchatComponent } from "../routes/newchat/newchat.component";

export const chatMenuOptions = [
  new HeaderMenuOption('chat info', 'info', new DynamicComponentRef(NewchatComponent)),
  new HeaderMenuOption('exit chat', 'chevron_right'),
];
export const mainMenuOptions = [
  new HeaderMenuOption('new group', 'add_circle_outline',  new DynamicComponentRef(GroupchatComponent)),
  new HeaderMenuOption('remove chat', 'remove_circle_outline', new DynamicComponentRef(DeletechatComponent)),
  new HeaderMenuOption('exit app', 'exit_to_app'),
];

export const UserIcon = new HeaderMenuOption('user info', 'info', new DynamicComponentRef(UserinfoComponent));
export const newChatIcon = new HeaderMenuOption('new chat', 'add_circle_outline',  new DynamicComponentRef(NewchatComponent));