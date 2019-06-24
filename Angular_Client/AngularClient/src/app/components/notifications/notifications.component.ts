import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private notificationService : NotificationService) { }
  title = 'Notifications Project'
  description = 'Start the server with npm start to listen for requests and click buttons to see the results in DB'
  show:boolean = false;
  _notificationSubscription : Subscription;
  notifications = []
  total_notifications;

  toggle() {
    this.show = !this.show;
  }
  addNotif(){
    this.notificationService.addNotifications();
    this.initUserNotifications();
  }
  deleteNotif(){
    this.notificationService.deleteNotifications();
    this.initUserNotifications();
  }
  showNotif(){
    this.toggle()
    this.initUserNotifications();
  }

  initUserNotifications(){
    console.log('Fetching in frontend user notifications ');
    this._notificationSubscription = this.notificationService.getNotifications()
      .subscribe(notif => {
        console.log('In subscribe');
        console.log(notif);
        this.notifications = [];
        if(notif['notifications_array']!=undefined){
          this.total_notifications = notif['notifications_array'].length;
          notif['notifications_array'].forEach(element => {
            console.log(element);
            this.notifications.push(element);
          });
        }
    });
  }


  ngOnInit() {
    this.initUserNotifications();
  }

}
