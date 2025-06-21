// pages/chatbotPage.js
exports.ChatbotPage = class ChatbotPage {
  constructor(page) {
    this.page = page;
    this.menuOption = page.locator("(//span[@class='menu-text'][normalize-space()='Enquiry & Admission'])[1]");
    this.addNewEnquiry = page.locator("//span[normalize-space()='Add New Enquiry']");
    this.chatButton = page.locator("(//div[@id='smtbotChatButton'])[1]");
    this.chatMessage = page.locator("(//div[@class='smtbot-message-content'])[1]");
    this.userInput = page.locator("//input[@id='smtbotUserInput']");
    this.sendButton = page.locator("//button[@id='smtbotSendButton']");
  }

  async openChatbot() {
    await this.menuOption.click();
    await this.addNewEnquiry.click();
    await this.chatButton.click();
    // await expect(this.chatMessage).toBeVisible();
  }

  async sendMessage(message) {
    const text = await this.chatMessage.textContent();
    console.log('Initial Chat Message:', text);
    await this.userInput.fill(message);
    await this.sendButton.click();
    await this.page.waitForTimeout(3000);
  }
};
