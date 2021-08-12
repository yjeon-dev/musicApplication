import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  results: Array<any> = [];
  searchQuery: any;
  routeSub: any;
  artistsSub: any;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicDataService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe((params) => {
      console.log('called search');
      this.searchQuery = params.q;
      console.log(params.q);
      this.artistsSub = this.musicService.searchArtists(params.q).subscribe(
        (data) => {
          console.log(data)
          this.results = data.artists?.items
            .filter((artist: any) => artist.images.length > 0)
            .sort(
              (a: { popularity: string }, b: { popularity: string }) =>
                a.popularity < b.popularity
            );
          if (this.results) {
            this.loading = false;
          }
        },
        (error) => {
          console.log(console.error('Invalid request.'));
          this.loading = false;
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.artistsSub.unsubscribe();
  }
}
