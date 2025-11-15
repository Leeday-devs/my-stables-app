const { chromium } = require('playwright');
const path = require('path');

async function captureScreenshots() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Desktop User Dashboard Screenshot
    console.log('Capturing user dashboard screenshot...');
    const userContext = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const userPage = await userContext.newPage();

    // Go to login page
    await userPage.goto('http://localhost:3000/auth/login');
    await userPage.waitForLoadState('networkidle');
    await userPage.waitForTimeout(1000);

    // Take screenshot of dashboard page (we'll just capture the layout)
    await userPage.goto('http://localhost:3000/dashboard');
    await userPage.waitForLoadState('networkidle');
    await userPage.waitForTimeout(2000);

    await userPage.screenshot({
      path: path.join(__dirname, '../public/user-dashboard-screenshot-v2.png'),
      fullPage: false
    });
    console.log('✓ User dashboard screenshot saved');
    await userContext.close();

    // Desktop Admin Dashboard Screenshot
    console.log('Capturing admin dashboard screenshot...');
    const adminContext = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const adminPage = await adminContext.newPage();

    await adminPage.goto('http://localhost:3000/admin');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000);

    await adminPage.screenshot({
      path: path.join(__dirname, '../public/admin-dashboard-screenshot-v2.png'),
      fullPage: false
    });
    console.log('✓ Admin dashboard screenshot saved');
    await adminContext.close();

    // Mobile User Screenshot
    console.log('Capturing user mobile screenshot...');
    const userMobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    });
    const userMobilePage = await userMobileContext.newPage();

    await userMobilePage.goto('http://localhost:3000/dashboard');
    await userMobilePage.waitForLoadState('networkidle');
    await userMobilePage.waitForTimeout(2000);

    await userMobilePage.screenshot({
      path: path.join(__dirname, '../public/user-mobile-screenshot-v2.png'),
      fullPage: true
    });
    console.log('✓ User mobile screenshot saved');
    await userMobileContext.close();

    // Mobile Admin Screenshot
    console.log('Capturing admin mobile screenshot...');
    const adminMobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    });
    const adminMobilePage = await adminMobileContext.newPage();

    await adminMobilePage.goto('http://localhost:3000/admin');
    await adminMobilePage.waitForLoadState('networkidle');
    await adminMobilePage.waitForTimeout(2000);

    await adminMobilePage.screenshot({
      path: path.join(__dirname, '../public/admin-mobile-screenshot-v2.png'),
      fullPage: true
    });
    console.log('✓ Admin mobile screenshot saved');
    await adminMobileContext.close();

    console.log('\n✅ All screenshots captured successfully!');
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
