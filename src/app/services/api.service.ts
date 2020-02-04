import { OfflineManagerService } from './offline-manager.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";
 
@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
  constructor(private http: HttpClient, private networkService: NetworkService, private storage: Storage, private offlineManager: OfflineManagerService) { }
 
  getData() {
    return new Promise((resolve, reject) => {
      if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
        // Return the cached data from Storage
        this.storage.get("data")
        .then(result => resolve(result))
        .catch(err => reject(err))
      } 
    
      else {
        this.http.get(`https://api.exchangeratesapi.io/latest`).subscribe({
          next: data => {
            let newData = data;
            newData["fetched_in"] = new Date();
            this.storage.set("data", newData)
            .then(_ => {
              console.log("Stored!");
            })
            .catch(_ => {
              console.log("Not Stored!");
            })
            .finally(() => resolve(newData))
          },
          error: err => reject(err)
        });
      }
    })
  }
}