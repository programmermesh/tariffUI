import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class SharedService {
  private baseUrl: string = environment.baseUrl;
  constructor(private _http: HttpClient) {}

  fetchTarrif(model: any) {
    return this._http.get<any>(`${this.baseUrl}/${model}`);
  }
}
