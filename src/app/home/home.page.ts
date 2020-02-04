import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient  } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  rates = {};
  ratesKeys = [];
  date = "";
  base = "";
  count = 0;
  fetched_in = null;
  formatedTime = "";
  fromCurrency = "";
  toCurrency = "";
  covertedValue = 0;
  amount = 0;

  constructor(private http: HttpClient, private storage: Storage, private apiService: ApiService, private plt: Platform) {
    this.loadData()
  }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadData();
    });
  }

  loadData() {
    this.apiService.getData().then(data => {
      this.count = 0;
      this.rates = data["rates"];
      this.date = data["date"];
      this.fetched_in = data["fetched_in"]
      this.ratesKeys = Object.keys(data["rates"]);
      this.storage.set('rates', data["rates"]);
      this.formatTime()
    });
  }

  public formatTime() {
    console.log(this.fetched_in)
  }

  public convertCurrency() {
    let amount = this.amount;
    let eurAmount = 0;
    let convertedAmount = 0;
    let fromCurrency = this.fromCurrency.trim();
    let toCurrency = this.toCurrency.trim();
    let rates = this.rates;
    
    console.log(rates)
    console.log(fromCurrency)
    console.log(toCurrency)
    console.log(rates[fromCurrency])
    console.log(rates[toCurrency])

    if(rates[fromCurrency] > 1) {
      eurAmount = amount / rates[fromCurrency];
    }

    else {
      eurAmount = amount * rates[fromCurrency];
    }

    console.log(eurAmount)

    if(rates[toCurrency] > 1) {
      convertedAmount = eurAmount * rates[toCurrency];
    }

    else {
      convertedAmount = eurAmount / rates[toCurrency];
    }

    console.log(convertedAmount);
    this.covertedValue = convertedAmount;
  }
}
