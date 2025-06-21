// pages/loginPage.js
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("//input[@placeholder='Username']");
    this.passwordInput = page.locator("//input[@id='passwordInput']");
    this.loginButton = page.locator("//button[@id='kt_login_signin_submit']");
  }

  async gotoLoginPage() {
    await this.page.goto('https://developer.netcampus.in/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForNavigation();
  }
};

