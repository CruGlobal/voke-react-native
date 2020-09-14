/* eslint-disable no-undef */
describe('Share Popups', () => {
  const email = 'autotest@vokeapptest.com';
  const pass = '12345678';
  const friendName = 'Guguza';

  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should be able to go to Sign In', async () => {
    await element(by.id('ctaSignIn')).tap();
    await element(by.id('inputEmail')).replaceText(email);
    await element(by.id('inputPassword')).replaceText(pass);
    await element(by.id('ctaSignInNow')).tap();
    await expect(element(by.id('tabAdventuresMy'))).toBeVisible();
  });

  it('should be able to go to Share Adventure from list', async () => {
    await element(by.id('tabAdventuresFind')).tap();
    await element(by.id('ctaShareIcon')).atIndex(0).tap();
    await element(by.id('inputFriendsName')).replaceText(friendName);
    await element(by.id('ctaContinue')).tap();
    await expect(element(by.id('ctaAllowNotifications'))).toBeVisible();
    await element(by.id('ctaHeaderClose')).tap();
    await expect(element(by.id('ctaShareLink'))).toBeVisible();
  });

  it('should be able to Close Share Modal', async () => {
    await element(by.id('ctaHeaderDone')).tap();
    await expect(element(by.id('tabAdventuresMy'))).toBeVisible();
  });

  it('should be able to see new created Invite', async () => {
    await element(by.id('tabAdventuresMy')).tap();
    await expect(element(by.text(`Waiting for ${friendName} to join...`))).toBeVisible();
  });

  it('should be able to go to Sign Out', async () => {
    // Menu > Profile > Logout
    await element(by.id('iconMenu')).tap();
    await element(by.id('menuProfile')).tap();
    await expect(element(by.id('textEmail'))).toHaveText(email);
    await element(by.id('ctaSignOut')).tap();
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
  });
});
