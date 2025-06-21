const { test, expect } = require('@playwright/test');
const fs = require('fs');
const fsp = fs.promises;

// ✅ Set default timeout for this test
test.setTimeout(300_000); // 5 minutes

test('Chatbot multi-turn interaction with dynamic replies', async ({ page }) => {
  const filePath = 'C:/Users/Saarc_Netcampus/OneDrive/Desktop/chatbot.txt';

  // Log when page closes unexpectedly
  page.on('close', () => {
    console.warn('⚠️ The page was closed unexpectedly!');
  });

  // Log test header
  try {
    await fsp.appendFile(filePath, `\n====================\nNew Test Run: ${new Date().toLocaleString()}\n====================\n`);
  } catch (err) {
    console.error(`❌ Failed to write header: ${err.message}`);
  }

  // Login

 await page.setViewportSize({ width: 1000, height: 720 });
  await page.goto('https://developer.netcampus.in/');
  await page.locator("input[placeholder='Username']").fill("admin");
  await page.locator("#passwordInput").fill("netkampus@2025");
  await page.locator("#kt_login_signin_submit").click();
  await page.waitForNavigation();
  await expect(page.locator("text=Developer School - 201 - [JUNE 2025 - MAY 2026]")).toBeVisible();

  // Open chatbot
  await page.locator("//h3[normalize-space()='To Do List']").scrollIntoViewIfNeeded();
  await page.locator("#smtbotChatButton").click();
  const messagesLocator = page.locator("div.smtbot-message-content");
  await expect(messagesLocator.first()).toBeVisible();

  const messagesToSend = [ "When is the admission deadline?",
            "What is the last date to apply for admission?",
            "Till when can I submit my admission application?",
            "Is there an extension for the admission deadline?",
            "Can I still apply for admission after the deadline?",
            "What is the cutoff date for admissions this year?",
            "When do admissions close?",
            "Is late admission possible?",
            "What happens if I miss the admission deadline?",
            "How much time do I have left to apply for admission?","What documents are required for admission?",
            "Which certificates do I need to submit for admission?",
            "Do I need to submit my previous mark sheets?",
            "Is an ID proof required for admission?",
            "What are the necessary documents for applying?",
            "Can I submit my documents online?",
            "Do I need to bring original documents for admission?",
            "Are notarized copies of documents accepted?",
            "Where should I upload my admission documents?",
            "Can I submit my documents after the deadline?","Am I eligible to apply for admission?",
            "What are the eligibility criteria for admission?",
            "What is the minimum percentage required for admission?",
            "Can I apply if I don’t meet the eligibility criteria?",
            "Do I need entrance exam scores for eligibility?",
            "Is there an age limit for admission?",
            "Can international students apply for admission?",
            "Are there any special eligibility rules for reserved categories?",
            "Do I need work experience for eligibility?",
            "Can I get admission without meeting the eligibility criteria?","What is the admission fee for this course?",
            "How much do I need to pay for admission?",
            "Can I pay my admission fee in installments?",
            "Is there any scholarship or fee waiver available?",
            "What is the mode of payment for the admission fee?",
            "Can I get a refund if I cancel my admission?",
            "Are there any additional charges apart from the admission fee?",
            "Is the admission fee different for international students?",
            "What is the late payment penalty for the admission fee?",
            "Can I apply for a fee concession?", "What is my admission status?",
            "Has my admission been approved?",
            "How can I check my admission status?",
            "When will I receive my admission confirmation?",
            "Where can I track my admission application?",
            "Can I edit my application after submission?",
            "Why is my admission status still pending?",
            "My application is rejected, can I reapply?",
            "How long does it take to get admission confirmation?",
            "Will I get an email regarding my admission status?","Can I change my course after admission?",
            "How do I request a course change?",
            "What is the process to change my course?",
            "Is there a fee for changing my admission course?",
            "Can I switch from one department to another?",
            "Until when can I change my course?",
            "Will changing my course affect my admission status?",
            "Can I shift to another branch after admission?",
            "Who should I contact for a course change request?",
            "What happens if my course change request is denied?","What are the prerequisites for this course?",
            "Do I need any prior knowledge before enrolling in this course?",
            "Are there any required subjects before I can take this course?",
            "Is an entrance exam required for this course?",
            "Can I take this course without completing the prerequisites?",
            "Where can I find the list of prerequisites for a course?",
            "Do I need any certifications before enrolling in this course?",
            "Are there any academic requirements for this course?",
            "Can I bypass the prerequisites with experience?",
            "Are prerequisite courses mandatory for enrollment?", "Can I change my course after enrollment?",
            "What is the process to change my enrolled course?",
            "Is there any fee for changing my course?",
            "Until when can I request a course change?",
            "Can I switch to another course mid-semester?",
            "Who should I contact to request a course change?",
            "Will my credits be transferred if I change my course?",
            "Can I change my course if I don’t like it?",
            "What documents are required for a course change request?",
            "Is there a deadline for course change requests?","Is this course available for enrollment?",
            "How can I check the availability of a course?",
            "Are there any seats left in this course?",
            "Is the course currently open for new students?",
            "Can I enroll in a full course if a seat becomes available?",
            "How many students are allowed in this course?",
            "When will the next batch for this course start?",
            "Is this course available for online enrollment?",
            "Can I get notified when the course is available?",
            "Are there any alternative courses if this one is full?","How do I withdraw from a course?",
            "Can I withdraw from a course after enrollment?",
            "Will I get a refund if I withdraw from my course?",
            "What is the deadline for course withdrawal?",
            "Is there a penalty for withdrawing from a course?",
            "Can I re-enroll in the course after withdrawing?",
            "Who should I contact to process my course withdrawal?",
            "What happens to my credits if I withdraw from a course?",
            "Can I withdraw from a course without affecting my GPA?",
            "Do I need approval to withdraw from a course?", "How much is the course fee?",
            "What is the total cost of enrolling in this course?",
            "Can I pay the course fee in installments?",
            "Are there any scholarships available for this course?",
            "Is there a discount for early course enrollment?",
            "What is the refund policy for course fees?",
            "Can I apply for financial aid for this course?",
            "Are there additional fees apart from the course tuition?",
            "What payment methods are accepted for the course fees?",
            "Are international students charged differently for this course?","What is the syllabus for the upcoming exam?",
            "Where can I find the syllabus for my exam?",
            "Is there a detailed syllabus available for my subject?",
            "Has the syllabus changed for this year's exam?",
            "Can I get a PDF of the exam syllabus?",
            "Are there any topics removed from the syllabus this year?",
            "What chapters are covered in the exam syllabus?",
            "Does the exam syllabus include practical topics?",
            "How can I get the latest syllabus updates?",
            "Is the exam syllabus the same for all students?","When will the exam results be announced?",
            "How can I check my exam results?",
            "Where can I find my exam score?",
            "What is the official website for exam results?",
            "Can I get my exam result via email?",
            "Will I receive a hard copy of my exam results?",
            "Are the exam results available online?",
            "Can I check my friend's exam results too?",
            "Is there a helpline for result-related queries?",
            "How can I request a re-evaluation of my exam results?","How do I apply for an exam revaluation?",
            "What is the process for getting my exam paper rechecked?",
            "Can I challenge my exam marks?",
            "Is there a fee for exam revaluation?",
            "What is the deadline for requesting an exam re-evaluation?",
            "How long does the revaluation process take?",
            "Can my marks be reduced after re-evaluation?",
            "Where can I submit my exam revaluation request?",
            "Who should I contact for exam re-evaluation queries?",
            "Is re-evaluation available for all subjects?","How can I improve my exam grades?",
            "Can I retake an exam to improve my grades?",
            "What is the procedure for grade improvement exams?",
            "Is there a special exam for students wanting to improve grades?",
            "Can I apply for multiple subjects in the grade improvement exam?",
            "Do I need to pay extra for grade improvement exams?",
            "Will my previous grade be replaced if I score lower?",
            "What is the eligibility for the grade improvement test?",
            "Are grade improvement exams held every year?",
            "Can I attend extra classes for grade improvement?", "Can I retake an exam if I fail?",
            "What is the procedure for exam retakes?",
            "When are the re-exams scheduled?",
            "Do I need to register for an exam retake?",
            "Is there an extra fee for retaking an exam?",
            "Can I retake an exam to improve my marks?",
            "Where can I apply for an exam retake?",
            "Are there any limits on how many times I can retake an exam?",
            "Will my retake exam have the same questions as before?",
            "Can I retake an exam next semester if I fail this time?","What is the deadline for fee payment?",
            "When do I need to pay my fees?",
            "Is there an extension for the fee deadline?",
            "What happens if I miss the fee deadline?",
            "Can I pay my fees after the deadline?",
            "Where can I check the last date for fee payment?",
            "Will I get a reminder for the fee deadline?",
            "Is there a late fee for missing the deadline?",
            "Can I request an extension for the fee deadline?",
            "What is the penalty for late fee submission?","What are the available payment methods for fees?",
            "Can I pay my fees online?",
            "Is UPI accepted for fee payment?",
            "Can I pay my fees via bank transfer?",
            "Do you accept credit or debit card payments for fees?",
            "Where can I make my fee payment?",
            "Can I pay my fees in cash?",
            "Is there an EMI option for fee payment?",
            "Are international payment methods accepted for fee payment?",
            "Do I need to submit proof of payment after paying fees?", "Are there any scholarships available for students?",
            "How can I apply for a fee scholarship?",
            "Who is eligible for a scholarship?",
            "What percentage of fees does the scholarship cover?",
            "Are there merit-based scholarships available?",
            "Does the institution offer financial aid for low-income students?",
            "Can I apply for multiple scholarships at once?",
            "When is the deadline to apply for scholarships?",
            "Are there any sports scholarships available?",
            "Will I lose my scholarship if my grades drop?","What happens if I don’t pay my fees on time?",
            "Is there a penalty for late fee payment?",
            "How much is the fine for missing the fee deadline?",
            "Can I appeal a fee penalty?",
            "Will I be de-enrolled if I don’t pay my fees?",
            "Can I still attend classes if I have unpaid fees?",
            "Will late fees increase over time?",
            "Can I pay my penalty online?",
            "Is there a waiver for fee penalties in special cases?",
            "Who should I contact regarding a fee penalty dispute?","How can I get my fee receipt?",
            "Where can I download my payment receipt?",
            "Can I request a duplicate fee receipt?",
            "Do I need a physical copy of my fee receipt?",
            "Will I get a receipt if I pay online?",
            "How long does it take to receive my fee receipt?",
            "Is my fee receipt required for future reference?",
            "Can I use my fee receipt for tax deductions?",
            "Who should I contact if I haven’t received my fee receipt?",
            "What details are included in the fee receipt?","Can I pay my fees in installments?",
            "Is there an EMI option for fee payment?",
            "How many installments are allowed for fee payment?",
            "Do I need special approval for paying in installments?",
            "Are there any extra charges for paying in installments?",
            "When are the installment due dates?",
            "What happens if I miss an installment payment?",
            "Is the installment option available for all students?",
            "Can I change my installment plan later?",
            "Where can I apply for fee installment payments?","How can I check the school inspection schedule?",
            "Who is responsible for organizing school inspections?",
            "Can I get reminders for upcoming inspections?",
            "Where can I find past inspection reports?",
            "What areas are evaluated during a school inspection?",
            "Can I request a change in the inspection date?",
            "How frequently are school inspections conducted?",
            "Are there specific criteria for inspection approval?",
            "Who conducts the school inspections?",
            "What steps should be taken to prepare for an inspection?","How can I submit a maintenance request for school facilities?",
            "Where can I track pending maintenance requests?",
            "Can I check the status of ongoing maintenance work?",
            "Who is responsible for approving maintenance requests?",
            "What is the process for emergency maintenance requests?",
            "Can I set a budget for maintenance work?",
            "Is there a list of completed maintenance tasks?",
            "Can I receive alerts for unresolved maintenance issues?",
            "Are there guidelines for prioritizing maintenance work?",
            "How often is the maintenance report updated?"];

  for (const message of messagesToSend) {
    let botReply = '';
    try {
      const beforeCount = await messagesLocator.count();

      // Ensure input is enabled
      await expect(page.locator("#smtbotUserInput")).toBeEnabled({ timeout: 10000 });

      // Send message
      await page.locator("#smtbotUserInput").fill(message);
      await page.locator("#smtbotSendButton").click();

      // Wait for at least one new message
      await expect(messagesLocator.nth(beforeCount)).toBeVisible({ timeout: 15000 });

      // Try to get the bot reply
      try {
        await expect(messagesLocator.nth(beforeCount + 1)).toBeVisible({ timeout: 10000 });
        botReply = await messagesLocator.nth(beforeCount + 1).textContent();
      } catch {
        if (!page.isClosed()) {
          botReply = await messagesLocator.nth(beforeCount).textContent();
        } else {
          botReply = '[Page closed before bot reply]';
        }
      }

    } catch (err) {
      botReply = `[Error occurred: ${err.message}]`;
    }

    const logEntry = `User: ${message}\nBot : ${botReply?.trim() || '[No reply]'}\n\n`;

    try {
      await fsp.appendFile(filePath, logEntry);
    } catch (err) {
      console.error(`❌ Failed to write log entry: ${err.message}`);
    }

    console.log(logEntry);
  }

  console.log(`✅ All messages sent and logged to: ${filePath}`);
});
