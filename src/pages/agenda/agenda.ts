import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { TaskProvider } from '../../providers/task/task';

@IonicPage({
  name: 'agenda'
})
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage {

  viewMode = 'all';
  tasks: any;
  loading: any;
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public authProvider: AuthProvider,
              public taskProvider: TaskProvider) {
  }

  ionViewDidLoad() {
    this.taskProvider.getTasks()
    .then((data) => {
      this.tasks = data;
    }, (err) => {
      console.log("not allowed");
    });
  }
 
  addTask() {
    let modal = this.modalCtrl.create('task');
    modal.onDidDismiss(task => {
      if (task) {
        this.showLoader();
        this.taskProvider.createTask(task)
        .then(result => {
          this.loading.dismiss();
          this.tasks = result;
          console.log("todo created");
        }, (err) => {
          this.loading.dismiss();
          console.log("not allowed");
        });
      }
    });
    modal.present();
  }
 
  deleteTask(task) {
    this.showLoader();
    //Remove from database
    this.taskProvider.deleteTask(task._id).then(result => {
      this.loading.dismiss();
      //Remove locally
      let index = this.tasks.indexOf(task);
      if (index > -1) {
        this.tasks.splice(index, 1);
      }
    }, (err) => {
      this.loading.dismiss();
      console.log("not allowed");
    });
  }
 
  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

}
