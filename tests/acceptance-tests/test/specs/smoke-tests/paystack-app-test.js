const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Payment by Paystack", function () {
  it("should be available when a user decides to buy a product", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    const guestEmail = usrData.guest_email;
    const guestPw = usrData.guest_pw;

    browser.windowHandleFullscreen();
    browser.waitForExist(".product-grid");
    browser.click(eleMap.login_dropdown_btn);
    browser.waitForExist(eleMap.login_btn);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), guestEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), guestPw);
    browser.click(eleMap.login_btn);
    browser.waitForExist("#logged-in-display-name");
    browser.pause(3000);
    browser.waitForExist(".introjs-skipbutton");
    browser.pause(3000);
    browser.url("http://localhost:3000/reaction/product/example-product");
    browser.pause(5000);
    browser.click(eleMap.red_option);
    browser.waitForExist(".add-to-cart-text");
    browser.click(".add-to-cart-text");
    browser.waitForExist("#btn-checkout");
    browser.click("#btn-checkout");
    browser.pause(5000);
    // shopUser.userAddress();

    browser.scroll(0, 400);
    browser.pause(3000);
    browser.click(eleMap.free_shipping);
    browser.waitForExist(".text-left");
    browser.click(".text-left");
    browser.pause(5000);
    browser.waitForExist("//span[text()='Paystack']");
    browser.click("//span[text()='Paystack']");
    browser.pause(5000);
    browser.scroll(0, 600);
    // browser.execute(() => {
    //   const drift = document.querySelector("button._2So8ItJQ9P6IqaCUlCO-2f.flex-center.DISMISS._3S6qOFxcrgO0yM2f9_l6JZ._364Vk0R65B1GXViJwyA9fM");
    //   drift.click();
    // });
    browser.waitForExist("input[name='payerEmail']");
    browser.setValue("input[name='payerEmail']", guestEmail);
    browser.pause(5000);
    browser.waitForExist("//form[@id='paystack-payment-form']/button");
    browser.click("//form[@id='paystack-payment-form']/button");
    browser.pause(5000);
    const frameCount = browser.selectorExecuteAsync("//iframe", function (frames, message, callback) {
      const paystackIframe = document.getElementsByTagName("iframe");
      const IframeName = paystackIframe[0].name;
      callback(IframeName);
    }, " iframe on the page");
    browser.pause(5000);
    browser.frame(frameCount);
    browser.pause(5000);
    browser.setValue(getId.customRetId(eleIds.cardnumber_id), "4084 0840 8408 4081");
    browser.setValue(getId.customRetId(eleIds.expire_id), "01 / 20");
    browser.setValue(getId.customRetId(eleIds.cvv_id), "408");
    browser.pause(5000);
    browser.click("#pay-btn");
    browser.pause(10000);
    expect(browser.getAttribute("div", "order-item")).to.exist;
  });
});
