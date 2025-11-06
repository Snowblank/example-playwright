import test, { expect } from "@playwright/test";
import Konva from "konva";
import { selectSeatAvailable } from "./utils/utils";
const Url = 'http://localhost:3000';
const Email = process.env.EMAIL ?? '';
const Password = process.env.PASSWORD ?? '';

declare global {
    interface Window {
        Konva: typeof Konva;
    }
}

test.describe('unlock-code', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`${Url}/home`);
        await page.waitForLoadState('load');
    });

    test('complete ticket booking with unlock showtime level', async ({ page }) => {
        test.setTimeout(120_000);
        // Step 1: Login
        await page.getByText('Login').click();
        await page.locator('input[name="email"]').fill(Email);
        await page.locator('input[name="password"]').fill(Password);
        await page.getByRole('button', { name: 'Continue' }).click();

        // Step 2: Select event
        await page.getByText('YASB - Seat').click();

        // wait for visible
        await page.waitForResponse((res) => res.url().includes('events/yasb/showtimes'))

        // Step 3: Select Showtime have Unlock-Code Button
        const unlockButton = page.getByRole('button', { name: 'Unlock' }).nth(1);
        await unlockButton.click();
        await page.getByRole('textbox', { name: 'Enter unlock code' }).fill('FRSTSHTM');
        await page.getByRole('button', { name: 'Apply' }).click();

        // wait for visible
        await page.waitForResponse((res) => res.url().includes('/unlock-codes/validate'))

        // Step 4: Search Zone 
        await page.getByText('Past').click();

        await page.waitForFunction(() => {
            return window.Konva?.stages?.length > 0;
        }, { timeout: 10000 });

        await page.waitForTimeout(5000)

        //select seat avaialble
        await selectSeatAvailable(page);

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
        await page.getByRole('button', { name: 'Propmptpay logo QR PromptPay' }).click({ delay: 5000 });

        // Step 8: Verify and click Pay Now
        const payButton = page.getByRole('button', { name: 'Pay Now' });
        await expect(payButton).toBeVisible({ timeout: 5000 });
        await expect(payButton).toBeEnabled();
        await payButton.click();

        await page.waitForResponse((res) => res.url().includes('/confirm') && res.status() === 200);

        // complete step not handler success payment if want to handler will use credit-card OMISE have handler success case and failed case
    })

    test('complete ticket booking with unlock ticket-type level', async ({ page }) => {
        test.setTimeout(120_000);
        // Step 1: Login
        await page.getByText('Login').click();
        await page.locator('input[name="email"]').fill(Email);
        await page.locator('input[name="password"]').fill(Password);
        await page.getByRole('button', { name: 'Continue' }).click();

        // Step 2: Select event
        await page.getByText('YASB - Seat').click();

        // wait for visible
        await page.waitForResponse((res) => res.url().includes('events/yasb/showtimes'))

        // Step 3: Select Showtime
        const buynowButton = page.getByRole('button', { name: 'BUY NOW' }).nth(1);
        await buynowButton.click();

        // Step 4: Search Zone 
        await page.getByText('VIP').nth(0).click();

        // Step 4.1: Select Zone have Unlock-Code Button
        await page.getByRole('textbox', { name: 'Enter unlock code' }).fill('VPSNGECD');
        await page.getByRole('button', { name: 'Apply' }).click();

        await page.waitForResponse((res) => res.url().includes('/unlock-codes/validate'))

        await page.getByText('FUTURE').nth(0).click();

        // wait for visible

        await page.waitForFunction(() => {
            return window.Konva?.stages?.length > 0;
        }, { timeout: 10000 });

        await page.waitForTimeout(5000)

        //select seat avaialble
        await selectSeatAvailable(page);

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
        await page.getByRole('button', { name: 'Propmptpay logo QR PromptPay' }).click({ delay: 5000 });

        // Step 8: Verify and click Pay Now
        const payButton = page.getByRole('button', { name: 'Pay Now' });
        await expect(payButton).toBeVisible({ timeout: 5000 });
        await expect(payButton).toBeEnabled();
        await payButton.click();

        await page.waitForResponse((res) => res.url().includes('/confirm') && res.status() === 200);

        // complete step not handler success payment if want to handler will use credit-card OMISE have handler success case and failed case
    })
});