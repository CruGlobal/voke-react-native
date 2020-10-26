const { signin, signout } = require('./shortcuts');
/* eslint-disable no-undef */
describe('Sharing Adventure', () => {
  const friendName = 'Guguza';
  let inviteCode = '';

  beforeAll(async () => {
    await device.reloadReactNative();
  });

  signin();

  it('can Share Adventure from list of Adventures', async () => {
    await element(by.id('tabAdventuresFind')).tap();
    await element(by.id('ctaShareIcon')).atIndex(0).tap();
    await element(by.id('inputName')).replaceText(friendName);
    await element(by.id('ctaContinue')).tap();
    await element(by.id('ctaNoNotifications')).tap();
    // https://github.com/wix/Detox/blob/DetoxNext/docs/APIRef.ActionsOnElement.md#getAttributes--ios-only
    const attributes = await element(by.id('invitationCode')).getAttributes();
    const inviteCodeTemp = attributes.text.split(': ');
    inviteCode = inviteCodeTemp[1];
    await expect(element(by.id('ctaShareLink'))).toBeVisible();
  });

  it('can Close Adventures Share Modal', async () => {
    await element(by.id('ctaHeaderDone')).tap();
    await expect(element(by.id('tabAdventuresMy'))).toBeVisible();
  });

  it('can see new created Invite', async () => {
    await element(by.id('tabAdventuresMy')).tap();
    await expect(element(by.id(inviteCode))).toBeVisible();
  });

  it('should display Invite as not expired', async () => {
    await element(by.id('tabAdventuresMy')).tap();
    await expect(
      element(by.id('expiresIn').withAncestor(by.id(inviteCode))),
    ).toBeVisible();
  });

  signout();
});
