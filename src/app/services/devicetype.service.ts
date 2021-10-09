import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DeviceTypeService {
  private _isMobile = false;
  constructor() {
    const UpperCaseUserAgent = navigator.userAgent.toUpperCase();
    console.group('userAgent');
    console.dir(UpperCaseUserAgent);
    console.groupEnd();
    const userAgentRes = UpperCaseUserAgent.includes('MOBILE');
    if (userAgentRes)
      this._isMobile = true;
  }

  get isMobile() {
    return this._isMobile;
  }
}
