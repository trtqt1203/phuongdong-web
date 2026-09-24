import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function runVerification() {
  console.log("Starting browser verification with Chrome...");
  const errors = [];
  const warnings = [];

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--use-gl=angle",
      "--use-angle=swiftshader", // ensures WebGL runs reliably in headless mode
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on("console", (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === "error") {
      errors.push(text);
      console.error(`[Browser Error]:`, text);
    } else if (type === "warn") {
      warnings.push(text);
      console.warn(`[Browser Warn]:`, text);
    } else {
      console.log(`[Browser Console]:`, text);
    }
  });

  page.on("pageerror", (err) => {
    errors.push(err.toString());
    console.error(`[Page Error]:`, err);
  });

  try {
    console.log("Navigating to http://localhost:3000 ...");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for atelier loader to fade out (approx 1.5s)
    console.log("Waiting for atelier loader to clear...");
    await new Promise((r) => setTimeout(r, 2000));

    // Verify 3D canvas is present
    const canvas = await page.$("canvas");
    console.log("Canvas element found:", Boolean(canvas));

    // Screenshot Hero
    const heroPath = path.resolve("test-desktop-hero.png");
    await page.screenshot({ path: heroPath });
    console.log("Captured hero screenshot:", heroPath);

    // Test Fabric section interaction
    console.log("Scrolling to fabric section...");
    await page.evaluate(() => {
      document.getElementById("fabric")?.scrollIntoView({ behavior: "instant" });
    });
    await new Promise((r) => setTimeout(r, 800));

    const fabricSwatches = await page.$$("button[aria-label^='Select fabric']");
    console.log("Found fabric swatches:", fabricSwatches.length);
    if (fabricSwatches.length > 2) {
      await fabricSwatches[2].click();
      console.log("Clicked 3rd fabric swatch");
      await new Promise((r) => setTimeout(r, 500));
    }

    // Scroll to Configurator section
    console.log("Scrolling to configurator section...");
    await page.evaluate(() => {
      document.getElementById("configurator-section")?.scrollIntoView({ behavior: "instant" });
    });
    await new Promise((r) => setTimeout(r, 1000));

    const configPath = path.resolve("test-configurator.png");
    await page.screenshot({ path: configPath });
    console.log("Captured configurator screenshot:", configPath);

    // Test Booking modal
    console.log("Opening booking modal...");
    const bookButtons = await page.$$("button");
    let bookClicked = false;
    for (const btn of bookButtons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text && text.includes("Book This Fitting")) {
        await btn.click();
        bookClicked = true;
        console.log("Clicked 'Book This Fitting' button");
        break;
      }
    }

    await new Promise((r) => setTimeout(r, 600));

    // Fill booking form
    const modal = await page.$("[role='dialog']");
    console.log("Booking dialog visible:", Boolean(modal));

    if (modal) {
      await page.type("#fullName", "Alexander Vance");
      await page.type("#phoneNumber", "+84 987 654 321");
      await page.type("#email", "alexander.vance@atelier.com");
      await page.type("#preferredDate", "2026-10-15");

      const modalPath = path.resolve("test-booking-modal.png");
      await page.screenshot({ path: modalPath });
      console.log("Captured booking modal screenshot:", modalPath);

      // Submit form
      const submitBtn = await page.$("button[type='submit']");
      if (submitBtn) {
        await submitBtn.click();
        console.log("Submitted booking form");
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    // Test Mobile Viewport
    console.log("Testing mobile viewport (390x844)...");
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 800));

    // Check horizontal scroll
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log("Mobile has horizontal overflow:", hasHorizontalOverflow);

    const mobilePath = path.resolve("test-mobile.png");
    await page.screenshot({ path: mobilePath });
    console.log("Captured mobile screenshot:", mobilePath);

    console.log("\n================ VERIFICATION SUMMARY ================");
    console.log("Total errors captured:", errors.length);
    console.log("Total warnings captured:", warnings.length);
    if (errors.length > 0) {
      console.error("Errors:", errors);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await browser.close();
    console.log("Browser closed successfully.");
  }
}

runVerification();
