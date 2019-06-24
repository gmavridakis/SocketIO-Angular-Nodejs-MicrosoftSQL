import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import {Notification} from '../model/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification : Notification;

  constructor(private socket: Socket) { }

  //OK
  getNotifications() {
    console.log('Send parameters for specific user');
    this.socket.emit('getNotifications');
    console.log('Receive a subscribe of user notifications');
    return this.socket.fromEvent<Notification>('server_current_notifications');
  }

  //pass a parameter to present this functionality
  addNotifications() {
    this.socket.emit('addNotifications', this.addNotification());
  }

  deleteNotifications() {
    this.socket.emit('deleteNotifications');
  }


  private addNotification(){
    let notification : Notification;
    notification = { domain : 'TnT' }
    notification.domain = 'TnT';
    return notification;
  }

}
