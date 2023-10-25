import { DeletechatComponent } from "../components/delete-chat/delete-chat.component";
import { GroupchatComponent } from "../routes/new-group/new-group.component";
import { UserinfoComponent } from "../routes/user-info/user-info.component";
import { DynamicComponentRef } from "../directives/dynamic-component.ref.directive";
import { HeaderMenuOption } from "../models/header-menu-option";
import { NewchatComponent } from "../routes/new-chat/new-chat.component";
import { ChatInfoComponent } from "../routes/group-chat-info/group-chat-info.component";

export const chatMenuOptions = [
  new HeaderMenuOption('chat info', 'info', new DynamicComponentRef(ChatInfoComponent)),
  new HeaderMenuOption('exit chat', 'chevron_right'),
];
export const mainMenuOptions = [
  new HeaderMenuOption('new group', 'add_circle_outline',  new DynamicComponentRef(GroupchatComponent)),
  new HeaderMenuOption('remove chat', 'remove_circle_outline', new DynamicComponentRef(DeletechatComponent)),
  new HeaderMenuOption('exit app', 'exit_to_app'),
];

export const UserIcon = new HeaderMenuOption('user info', 'info', new DynamicComponentRef(UserinfoComponent));
export const newChatIcon = new HeaderMenuOption('new chat', 'add_circle_outline',  new DynamicComponentRef(NewchatComponent));