export class SideMenuElements {
  private readonly search: string = 'input[placeholder="Search"]';
  private readonly admin: string = '//a[.//span[normalize-space()="Admin"]]';
  private readonly pim: string = '//a[.//span[normalize-space()="PIM"]]';
  private readonly leave: string = '//a[.//span[normalize-space()="Leave"]]';
  private readonly time: string = '//a[.//span[normalize-space()="Time"]]';
  private readonly recruitment: string =
    '//a[.//span[normalize-space()="Recruitment"]]';
  private readonly myInfo: string = '//a[.//span[normalize-space()="My Info"]]';
  private readonly performance: string =
    '//a[.//span[normalize-space()="Performance"]]';
  private readonly dashboard: string =
    '//a[.//span[normalize-space()="Dashboard"]]';
  private readonly directory: string =
    '//a[.//span[normalize-space()="Directory"]]';
  private readonly maintenance: string =
    '//a[.//span[normalize-space()="Maintenance"]]';
  private readonly claim: string = '//a[.//span[normalize-space()="Claim"]]';

  public getSearch(): string {
    return this.search;
  }

  public getAdmin(): string {
    return this.admin;
  }

  public getPIM(): string {
    return this.pim;
  }

  public getLeave(): string {
    return this.leave;
  }

  public getTime(): string {
    return this.time;
  }

  public getRecruitment(): string {
    return this.recruitment;
  }

  public getMyInfo(): string {
    return this.myInfo;
  }

  public getPerformance(): string {
    return this.performance;
  }

  public getDashboard(): string {
    return this.dashboard;
  }

  public getDirectory(): string {
    return this.directory;
  }

  public getMaintenance(): string {
    return this.maintenance;
  }

  public getClaim(): string {
    return this.claim;
  }
}
