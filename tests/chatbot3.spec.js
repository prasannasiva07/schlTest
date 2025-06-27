const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;

test.setTimeout(300_000); // 5 minutes

// Test cases with expected keywords
const testCases = [
  {
    message: "When is the admission deadline?",
    expectedKeywords: ["admission deadline", "admissions close", "apply until"]
  },
  {
    message: "How can I reset my password?",
    expectedKeywords: ["password manager", "forgot password", "password recovery"]
  },
//   {
//     message: "What courses do you offer?",
//     expectedKeywords: ["courses", "programs", "offerings", "curriculum"]
//   },
  {
    message: "Blah blah invalid input",
    expectedKeywords: ["sorry", "didn't understand", "can you rephrase", "I don't know"],
    expectFailure: true
    
  },
  {
    message:"asgdhaghdggsadh ashdhasjdhjsha jahsdjhashdjah",
    expectedKeywords: ["sorry", "didn't understand", "can you rephrase", "I don't know"],
    expectFailure: true
  }
];

// Log file path
const filePath = 'C:/Users/Saarc_Netcampus/OneDrive/Desktop/chatbot1.txt';

test.describe.configure({ mode: 'serial' }); // Run tests in sequence

// Reusable login + open chatbot
test.beforeEach(async ({ page }) => {
  await page.goto('https://developer.netcampus.in/');
  await page.locator("input[placeholder='Username']").fill("admin");
  await page.locator("#passwordInput").fill("netkampus@2025");
  await page.locator("#kt_login_signin_submit").click();
  await page.waitForNavigation();
  await page.locator("//h3[normalize-space()='To Do List']").scrollIntoViewIfNeeded();
  await page.locator("#smtbotChatButton").click();
});

// Normalize text for better matching
function normalize(text) {
  return text.toLowerCase().replace(/[.,!?]/g, '');
}

// Main test loop
for (const { message, expectedKeywords, expectFailure } of testCases) {
  test(`Check chatbot reply to: "${message}"`, async ({ page }) => {
    const messages = page.locator("div.smtbot-message-content");
    const beforeCount = await messages.count();

    // Send user message
    await page.locator("#smtbotUserInput").fill(message);
    await page.locator("#smtbotSendButton").click();

    // Wait for bot response
    let botReply = '';
    try {
      await messages.nth(beforeCount).waitFor({ timeout: 15000 });
      botReply = (await messages.nth(beforeCount + 1).textContent())?.trim() || '';
    } catch (error) {
      botReply = '[No bot reply received]';
    }

    // Check if the bot reply includes any expected keyword
    const isCorrect = expectedKeywords.some(kw =>
      normalize(botReply).includes(normalize(kw))
    );

    // Log result
    const timestamp = new Date().toLocaleString();
    const log = `---\n[${timestamp}]\nUser: ${message}\nBot : ${botReply}\nResult: ${isCorrect ? '✅ Match' : '❌ No Match'}\n\n`;
    await fs.appendFile(filePath, log);
    console.log(log);

    // Assertions
    if (expectFailure) {
      if (!isCorrect) {
        console.log("✅ Negative test passed (unexpected input, unhelpful bot reply).");
      } else {
        console.warn("❌ Bot unexpectedly gave a helpful answer for invalid input.");
      }
      expect(isCorrect).toBeFalsy();
    } else {
      if (isCorrect) {
        console.log("✅ Bot reply matched expected keywords.");
      } else {
        console.warn("❌ Bot reply did NOT match expected keywords.");
      }
      expect(isCorrect).toBeTruthy();
    }
  });
}
