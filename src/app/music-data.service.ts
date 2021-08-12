import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';

import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MusicDataService {
  favoritesList: Set<string>;

  constructor(
    private spotifyToken: SpotifyTokenService,
    private http: HttpClient
  ) {
    this.favoritesList = new Set<string>();
  }

  //1. getNewReleases()
  getNewReleases(): Observable<any> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(
          'https://api.spotify.com/v1/browse/new-releases',
          { headers: { Authorization: `Bearer ${token}` } }
        );
      })
    );
  }

  //2. getArtistById(id)
  getArtistById(id: string): Observable<any> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
    );
  }

  //3. getAlbumsByArtistId(id)
  getAlbumsByArtistId(id: string): Observable<any> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(
          `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  //4. getAlbumById(id)
  getAlbumById(id: string): Observable<any> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(`https://api.spotify.com/v1/albums/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
    );
  }

  //5. searchArtists(searchString)
  searchArtists(artist: string): Observable<any> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(
          `https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      })
    );
  }

  //6. addToFavourites(id)
  addToFavorites(id: string): boolean {
    if (!this.favoritesList) {
      this.favoritesList = new Set<string>();
    }
    if (id && this.favoritesList.size < 50) {
      this.favoritesList?.add(id);
      return true;
    }
    return false;
  }

  //7. removeFromFavourites(id)
  removeFromFavorites(id: string): Observable<any> {
    if (this.favoritesList) {
      this.favoritesList.delete(id);
    }
    return this.getFavorites();
  }

  //8. getFavourites()
  getFavorites(): Observable<any> {
    if (this.favoritesList && this.favoritesList.size > 0) {
      let ids: string = [...this.favoritesList].join(',');
      return this.spotifyToken.getBearerToken().pipe(
        mergeMap((token) => {
          return this.http.get<any>(
            `https://api.spotify.com/v1/tracks?ids=${ids}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
    }
    return new Observable((o) => {
      o.next([]);
    });
  }
}
