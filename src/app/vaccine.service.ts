import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class VaccineService {
    private url = 'https://cdn-api.co-vin.in/api';

    constructor(private http: HttpClient) {}

    getStateDetails(): Observable<any> {
        return this.http.get(this.url + '/v2/admin/location/states');
    }

    getDistrictDetails(stateId: string): Observable<any> {
        return this.http.get(this.url + '/v2/admin/location/districts/' + stateId);
    }

    getVaccineDetails(districtId: string, date: any): Observable<any> {
        return this.http.get(this.url + '/v2/appointment/sessions/public/calendarByDistrict?district_id=' + districtId + '&date=' + date);
    }
}
