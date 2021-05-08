import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VaccineService {
    private url = "https://cdn-api.co-vin.in/api";

    getStateDetails(): Observable<any> {
        return this.http.get(this.url+"/v2/admin/location/states");
    }

    getDistrictDetails(state_id: string): Observable<any> {
        return this.http.get(this.url+"/v2/admin/location/districts/"+state_id);
    }
    getVaccineDetails(district_id: string, date: string): Observable<any> {
        return this.http.get(this.url+"​/v2​/appointment​/sessions​/public​/calendarByDistrict?district_id="+district_id+"&date="+date);
    }
}