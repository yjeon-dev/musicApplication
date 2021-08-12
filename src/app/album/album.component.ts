import { Component, OnDestroy, OnInit } from '@angular/core';

// 추가
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit, OnDestroy {
  album: any;
  albumSub: any;
  routeSub: any;
  loading: boolean = true;

  constructor(
    private musicService: MusicDataService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.albumSub = this.musicService.getAlbumById(params.id).subscribe(
        (data) => {
          this.album = data;
          if (this.album) {
            this.loading = false;
          }
        },
        (error) => {
          console.log(console.error('Invalid album id.'));
          this.loading = false;
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.albumSub.unsubscribe();
  }

  addToFavorites(trackID: string): void {
    console.log('clicked' + trackID);
    if (this.musicService.addToFavorites(trackID)) {
      this.snackBar.open('Adding to Favourites...', 'Done', {
        duration: 1500,
      });
    } else {
      this.snackBar.open(
        'Sorry, you reached max number for favourite tracks (50).',
        'Done',
        {
          duration: 1500,
        }
      );
    }
  }
}
