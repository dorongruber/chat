import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DeviceTypeService {
  private _isMobile = false;
  constructor() {
    const UpperCaseUserAgent = navigator.userAgent.toUpperCase();
    const userAgentRes = UpperCaseUserAgent.includes('MOBILE');
    if (userAgentRes)
      this._isMobile = true;
  }

  get isMobile() {
    return this._isMobile;
  }
}
