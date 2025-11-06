import test, { expect } from "@playwright/test";

const Url = 'http://localhost:3000';
const Email = process.env.EMAIL ?? '';
const Password = process.env.PASSWORD ?? '';

test.describe('unlock-code', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${Url}/home`);
        await page.waitForLoadState('load');
    });

    test('complete ticket booking with unlock showtime level', async ({ page }) => {
        // Step 1: Login
        await page.getByText('Login').click();
        await page.locator('input[name="email"]').fill(Email);
        await page.locator('input[name="password"]').fill(Password);
        await page.getByRole('button', { name: 'Continue' }).click();

        // Step 2: Select event
        await page.getByText('YASB - NoneSeat').click();

        // wait for visible
        await page.waitForResponse((res) => res.url().includes('events/yasb-noneseat/showtimes'))

        // Step 3: Select Showtime have Unlock-Code Button
        const unlockButton = page.getByRole('button', { name: 'Unlock' }).nth(0);
        await unlockButton.click();
        await page.getByRole('textbox', { name: 'Enter unlock code' }).fill('FRSTSHTM');
        await page.getByRole('button', { name: 'Apply' }).click();

        // wait for visible
        await page.waitForResponse((res) => res.url().includes('/unlock-codes/validate'))

        // Step 4: Add Amount Ticket Not Lock
        await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();

        // Step 5: Press Checkout Button
        const checkoutButton = page.getByRole('button', { name: 'CHECK OUT' });
        await expect(checkoutButton).toBeEnabled({ timeout: 5000 });
        await checkoutButton.click();

        // Step 6: Handler if Have Order Process In User will Cancel Before
        const ongoingOrderDialog = page.getByText('You currently have an ongoing order.');
        try {
            await ongoingOrderDialog.waitFor({ state: 'visible', timeout: 10000 });
            await page.getByRole('button', { name: 'cancel & purchase new tickets' }).click();
            await ongoingOrderDialog.waitFor({ state: 'hidden' });
        } catch {
            // Dialog didn't appear - that's fine
        }

        // Step 7: Select Payment-Method
        await page.getByRole('button', { name: 'Propmptpay logo QR PromptPay' }).click();

        // Step 8: Verify and click Pay Now
        const payButton = page.getByRole('button', { name: 'Pay Now' });
        await expect(payButton).toBeVisible({ timeout: 5000 });
        await expect(payButton).toBeEnabled();
        await payButton.click();

        await page.waitForResponse((res) => res.url().includes('/confirm') && res.status() === 200);
        // complete step not handler success payment if want to handler will use credit-card OMISE have handler success case and failed case
    })

    test('complete ticket booking with unlock ticket-type level', async ({ page }) => {
        // Step 1: Login
        await page.getByText('Login').click();
        await page.locator('input[name="email"]').fill(Email);
        await page.locator('input[name="password"]').fill(Password);
        await page.getByRole('button', { name: 'Continue' }).click();

        // Step 2: Select event
        await page.getByText('YASB - NoneSeat').click();

        // wait for visible
        await page.waitForResponse((res) => res.url().includes('events/yasb-noneseat/showtimes'))

        // Step 3: Select Showtime
        const buynowButton = page.getByRole('button', { name: 'BUY NOW' }).nth(1);
        await buynowButton.click();

        // wait for visible
        await page.waitForResponse((res) => res.url().includes('/events/yasb-noneseat/showtimes'))

        // Step 3.1 Select Ticket have Unlock-Code Button
        const unlockButton = page.getByRole('button', { name: 'Unlock' }).nth(0);
        await unlockButton.click();

        await page.getByRole('textbox', { name: 'Enter unlock code' }).fill('VVPPYASB');
        await page.getByRole('button', { name: 'Apply' }).click();

        // wait for visible
        await page.waitForResponse((res) => res.url().includes('/unlock-codes/validate'))

        // wait for visible button
        // Step 4: Add Amount Ticket Not Lock
        await page.getByRole('button').nth(10).click({ timeout: 10000 });

        // Step 5: Press Checkout Button
        const checkoutButton = page.getByRole('button', { name: 'CHECK OUT' });
        await expect(checkoutButton).toBeEnabled({ timeout: 5000 });
        await checkoutButton.click();

        // Step 6: Handler if Have Order Process In User will Cancel Before
        const ongoingOrderDialog = page.getByText('You currently have an ongoing order.');
        try {
            await ongoingOrderDialog.waitFor({ state: 'visible', timeout: 10000 });
            await page.getByRole('button', { name: 'cancel & purchase new tickets' }).click();
            await ongoingOrderDialog.waitFor({ state: 'hidden' });
        } catch {
            // Dialog didn't appear - that's fine
        }

        // Step 7: Select Payment-Method
        await page.getByRole('button', { name: 'Propmptpay logo QR PromptPay' }).click();

        // Step 8: Verify and click Pay Now
        const payButton = page.getByRole('button', { name: 'Pay Now' });
        await expect(payButton).toBeVisible({ timeout: 5000 });
        await expect(payButton).toBeEnabled();
        await payButton.click();

        await page.waitForResponse((res) => res.url().includes('/confirm') && res.status() === 200);

        // complete step not handler success payment if want to handler will use credit-card OMISE have handler success case and failed case
    })
});