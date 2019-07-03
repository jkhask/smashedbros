import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChallongeService {

  endpoint = 'https://api.challonge.com/v1/';
  apiKey = 'UYb8yZE5cjy0fhuNlfCZl0ytF3P0c5hxMPK6rYP7';

  constructor(private http: HttpClient) { }
}
