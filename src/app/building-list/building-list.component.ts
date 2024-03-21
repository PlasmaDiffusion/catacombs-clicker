import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { Building } from '../building';
import { BuildingButtonComponent } from '../building-button/building-button.component';
import { CookieService } from 'ngx-cookie-service';

//Hard coded list of buildings here
const baseBuildings: Building[] = [
  { name: 'Warrior', owned: 0, price: 10, goldPerSecond: 1 },
  { name: 'Wizard', owned: 0, price: 100, goldPerSecond: 5 },
  { name: 'Cleric', owned: 0, price: 500, goldPerSecond: 10 },
  { name: 'Thief', owned: 0, price: 2500, goldPerSecond: 50 },
];

//Stores buildings, renders a list of them, and handles code to buy a building
@Component({
  selector: 'app-building-list',
  standalone: true,
  imports: [NgFor, BuildingButtonComponent],
  templateUrl: './building-list.component.html',
  styleUrl: './building-list.component.scss',
})
export class BuildingListComponent {
  @Input() gold: number = 0;
  @Output() onUpdateGold = new EventEmitter<number>();

  buildings: Building[];

  constructor(private cookieService: CookieService) {
    this.generateGoldFromBuildings();
    this.saveBuildings();


    this.buildings = baseBuildings;

    let buildingCookie = cookieService.get('Buildings');
    let loadedBuildings : Building[] = JSON.parse(buildingCookie)
    if (buildingCookie)
    {
      this.buildings = [...loadedBuildings]

    }
    console.log("*loaded buildings", this.buildings);
  }

  //Buy a building and up the price
  buyBuilding(building: Building) {
    let indexToBuy = 0;
    this.buildings.forEach((currentBuilding, currentIndex) => {
      if (building.name === currentBuilding.name) {
        indexToBuy = currentIndex;
      }
    });

    this.onUpdateGold.emit(this.gold - building.price);
    this.buildings[indexToBuy].owned++;
    console.log(building);

    let price = this.buildings[indexToBuy].price;
    let owned = this.buildings[indexToBuy].owned;
    this.buildings[indexToBuy].price = Math.round(price * (1 + owned / 10));
  }

  generateGoldFromBuildings() {
    setInterval(() => {
      let goldToGain = 0;
      this.buildings.forEach((building) => {
        goldToGain += building.goldPerSecond * building.owned;
      });
      this.onUpdateGold.emit(this.gold + goldToGain);
    }, 1000);
  }

  saveBuildings() {
    setInterval(() => {
      if (this.cookieService.get('cookiesAccepted')) {
        this.cookieService.set('Buildings', JSON.stringify(this.buildings));
      }
    }, 6000);
  }
}
