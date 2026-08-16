export class LoginElements {
  private readonly usernameInput: string = 'input[name="username"]';
  private readonly passwordInput: string = 'input[name="password"]';
  private readonly loginButton: string = 'button[type="submit"]';
  private readonly dashboardHeader: string = '//h6[normalize-space()="Dashboard"]';

  public getUsernameInput(): string {
    return this.usernameInput;
  }

  public getPasswordInput(): string {
    return this.passwordInput;
  }

  public getLoginButton(): string {
    return this.loginButton;
  }

  public getDashboardHeader(): string {
    return this.dashboardHeader;
  }
}
