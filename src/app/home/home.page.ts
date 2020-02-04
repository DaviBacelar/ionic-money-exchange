import { Component } from '@angular/core';
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
  formatedTime = "";
  fromCurrency = "";
  toCurrency = "";
  covertedValue = 0;
  amount = 0;

  constructor(private http: HttpClient, private storage: Storage) {
    this.fecthData()

    setInterval(() => {
      this.count++;
      this.formatTime(); 
      }, 1000);
  }
  
  public changeBase() {
    console.log(this.base);
    // this.base = param;
    this.fecthData();
  }

  public formatTime() {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let rest = 0;
    let formatedTime = "";

    if(this.count >= 360)  {
      hours = this.count / 60;
      rest = this.count - (60 * hours);
      formatedTime = hours.toString();
      formatedTime += " horas";
    }
    
    if(rest >= 60) {
      if(hours > 0) {
        formatedTime += ", ";
      }
      minutes = this.count / 60;
      rest = this.count - (60 * hours);
      formatedTime = minutes.toString();
      formatedTime += " minutos"
    }

    if(hours > 0 || minutes > 0) {
      formatedTime += " e ";
      formatedTime = rest.toString();      
    }

    else {
      formatedTime = this.count.toString();
    }

    formatedTime += " segundos";
    this.formatedTime = formatedTime;
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

  test() {
    this.storage.get('rates')
    .then((result) => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    })
  }

  fecthData() {
    this.http.get(`https://api.exchangeratesapi.io/latest`).subscribe({
        next: data => {
                        console.log(data)
                        this.count = 0;
                        this.rates = data["rates"];
                        this.date = data["date"];
                        this.ratesKeys = Object.keys(data["rates"]);
                        this.storage.set('rates', data["rates"])
                        .then(res => {
                          console.log(res);
                        })
                        .catch(err => {
                          console.log(err);
                        })
                      },
        error: err => console.log(err)
      });
  }
}
