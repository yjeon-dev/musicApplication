import { Component, OnDestroy, OnInit } from '@angular/core';

import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent implements OnInit, OnDestroy {
  favourites: Array<any> = [];
  favouriteSub: any;

  constructor(private musicService: MusicDataService) {}

  ngOnInit(): void {
    this.favouriteSub = this.musicService.getFavorites().subscribe((data) => {
      console.log(data);
      this.favourites = data.tracks;
    });
  }

  ngOnDestroy(): void {
    this.favouriteSub.unsubscribe();
  }

  handleRemoveClick(id: string): void {
    this.favouriteSub = this.musicService
      .removeFromFavorites(id)
      .subscribe((data) => {
        this.favourites = data.tracks;
      });
  }
}
