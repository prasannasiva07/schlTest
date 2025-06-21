// test.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../tests/loginPage');
const { ChatbotPage } = require('../tests/chatbotPage');

test('Modular test using Page Object Model', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const chatbotPage = new ChatbotPage(page);

  await loginPage.gotoLoginPage();
  await loginPage.login("admin", "netkampus@2025");

  await expect(page.locator("(//div[normalize-space()='Developer School - 201 - [JUNE 2025 - MAY 2026]'])[1]")).toBeVisible();
  await page.waitForTimeout(6000);

  await chatbotPage.openChatbot();
  await chatbotPage.sendMessage("hi");

  console.log('Test completed successfully');
});
