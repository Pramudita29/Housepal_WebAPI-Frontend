import { expect, test } from '@playwright/test';

// Fresh tokens (regen if expired)
const seekerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiU2Vla2VyIiwiaWF0IjoxNzQwNjc0NzYxLCJleHAiOjE3NDA2NzgzNjF9.es9Z4UIJvH2KqInVEOTc_66F9icC1t6Z7W-V4aQDuyE';
const helperToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiSGVscGVyIiwiaWF0IjoxNzQwNjc0NzYxLCJleHAiOjE3NDA2NzgzNjF9.M41CsMsy_zXcs3qERhGyNsa88UurezBeoS7ZHKPXL34';

test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => console.log('Browser console:', msg.text()));
    page.on('pageerror', (err) => console.log('Page error:', err.message()));
    page.on('request', (req) => console.log('Request:', req.url(), req.method(), req.postData()));
    page.on('response', (res) => console.log('Response:', res.url(), res.status(), res.body().catch(() => 'No body')));

    await page.goto('http://localhost:5173/login');
    await page.evaluate((token) => localStorage.setItem('token', token), seekerToken);

    await page.route('http://localhost:3000/api/auth/me', (route) =>
        route.fulfill({
            status: 200,
            body: JSON.stringify({ email: 'test@example.com', fullName: 'Test User', role: 'Seeker', skills: ['Plumbing'], experience: '5 years' }),
        })
    );
    await page.route('http://localhost:3000/api/auth/register', (route) =>
        route.fulfill({
            status: 200,
            body: JSON.stringify({ token: seekerToken, role: 'Seeker', email: 'test@example.com', fullName: 'Test User' }),
        })
    );
    await page.route('http://localhost:3000/api/auth/login', (route) =>
        route.fulfill({
            status: 200,
            body: JSON.stringify({ token: seekerToken, role: 'Seeker' }),
        })
    );
    await page.route('http://localhost:3000/auth/login', (route) =>
        route.fulfill({
            status: 200,
            body: JSON.stringify({ token: seekerToken, role: 'Seeker' }),
        })
    );
    await page.route('http://localhost:3000/api/jobs', (route) =>
        route.fulfill({
            status: 200,
            body: JSON.stringify([
                { _id: '1', jobTitle: 'Cleaning Job', category: 'Cleaning', posterEmail: 'test@example.com', status: 'Open' },
            ]),
        })
    );
    await page.route('http://localhost:3000/api/tasks/helper/**', (route) =>
        route.fulfill({
            status: 200,
            body: JSON.stringify([{ _id: '1', jobTitle: 'Test Task', status: 'pending' }]),
        })
    );
    await page.route('http://localhost:3000/api/helper/**', (route) =>
        route.fulfill({
            status: 200,
            body: JSON.stringify({
                data: { fullName: 'Test User', email: 'test@example.com', skills: ['Plumbing'], experience: '5 years' },
            }),
        })
    );
    await page.route('http://localhost:3000/api/jobs/1', (route) =>
        route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true }),
        })
    );
    await page.route('http://localhost:3000/api/notifications', (route) =>
        route.fulfill({ status: 200, body: JSON.stringify([]) })
    );
    await page.route('**/reviews', (route) =>
        route.fulfill({ status: 200, body: JSON.stringify([]) })
    );
    await page.route('**/applications', (route) =>
        route.fulfill({ status: 200, body: JSON.stringify([]) })
    );
});

test.describe('HousePal Application UI Tests', () => {
    test('1. should display login form elements on AuthPage', async ({ page }) => {
        await page.goto('http://localhost:5173/login');
        await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 60000 });
        await expect(page.locator('input[name="password"]')).toBeVisible({ timeout: 60000 });
        await expect(page.locator('button:text("Login")').first()).toBeVisible({ timeout: 60000 });
    });

    test('2. should switch to register form and display fields', async ({ page }) => {
        await page.goto('http://localhost:5173/login');
        await page.click('button:text("Register")');
        await expect(page.locator('input[name="fullName"]')).toBeVisible({ timeout: 60000 });
        await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 60000 });
        await expect(page.locator('input[name="contactNo"]')).toBeVisible({ timeout: 60000 });
    });

    test('3. should fill job post form and verify values', async ({ page }) => {
        await page.goto('http://localhost:5173/seeker/post-job');
        await page.fill('input[name="jobTitle"]', 'Test Cleaning Job');
        await page.fill('textarea[name="jobDescription"]', 'Need a cleaner');
        await page.selectOption('select[name="category"]', 'Cleaning');
        await expect(page.locator('input[name="jobTitle"]')).toHaveValue('Test Cleaning Job', { timeout: 60000 });
        await expect(page.locator('textarea[name="jobDescription"]')).toHaveValue('Need a cleaner', { timeout: 60000 });
        await expect(page.locator('select[name="category"]')).toHaveValue('Cleaning', { timeout: 60000 });
    });

    test('4. should display job list on SeekerJobs page', async ({ page }) => {
        await page.goto('http://localhost:5173/seeker/jobs');
        await expect(page.locator('h1:text("Your Posted Jobs")')).toBeVisible({ timeout: 60000 });
        await expect(page.locator('h3:text("Cleaning Job")')).toBeVisible({ timeout: 60000 });
    });

    test('5. should show delete button on job list', async ({ page }) => {
        await page.goto('http://localhost:5173/seeker/jobs');
        await expect(page.locator('button:text("Delete")')).toBeVisible({ timeout: 60000 });
    });

    test('6. should fill search input on SeekerJobs page', async ({ page }) => {
        await page.goto('http://localhost:5173/seeker/jobs');
        await page.fill('input[placeholder*="Search jobs"]', 'Cleaning');
        await expect(page.locator('input[placeholder*="Search jobs"]')).toHaveValue('Cleaning', { timeout: 60000 });
    });

    test('7. should display task list on HelperTasks page', async ({ page }) => {
        await page.evaluate((token) => localStorage.setItem('token', token), helperToken);
        await page.goto('http://localhost:5173/helper/tasks');
        await expect(page.locator('text=Test Task')).toBeVisible({ timeout: 60000 });
        await expect(page.locator('.bg-gray-100:has-text("In Progress")')).toBeVisible({ timeout: 60000 });
    });
});