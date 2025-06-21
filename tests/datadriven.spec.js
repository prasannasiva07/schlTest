const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');
// Define correct absolute path to your Excel file
const excelFilePath = path.resolve('C:/Users/Saarc_SMT/Desktop/login_datadriven.xlsx');
// Function to read Excel data
function getExcelData(filePath, sheetName) {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet); // [{ Username, Password }]
}
// Single test looping through users
test('Login for each user from Excel in one test case', async ({ page }) => {
    const loginData = getExcelData(excelFilePath, 'Sheet1'); // use correct path here
    for (const { Username, Password } of loginData) {
        console.log(`Attempting login for user: ${Username}`);
        await page.goto('https://jubilant-darkness-qidltchfum5o.on-vapor.com', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await page.locator('span', { hasText: 'Staff' }).first().click();
        await page.getByPlaceholder('Enter username').fill(Username);
        await page.getByPlaceholder('Enter password').fill(Password);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.waitForTimeout(3000); // optional wait
    }
});