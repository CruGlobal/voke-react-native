const moment = require('moment');

const { signin, signout, waitForToast } = require('./shortcuts');

/* eslint-disable no-undef */
describe('Group Adventure With Daily Release', () => {
  const secondUserEmail = 'autotest2@vokeapptest.com';
  const secondUserPass = '12345678';
  const secondUserFirstName = 'Autotest 2';
  const secondUserLastName = 'Detox Robot';

  const thirdUserEmail = 'autotest3@vokeapptest.com';
  const thirdUserPass = '12345678';
  const thirdUserFirstName = 'Autotest 3';
  const thirdUserLastName = 'Detox Robot';

  const groupName = 'Daily Release Group Test - ';
  let inviteCode = '';

  const randomId = Math.floor(Math.random() * 1000) + 1;

  beforeAll(async () => {
    await device.reloadReactNative();
  });

  signin();

  it('can create a Group with daily release mode', async () => {
    await element(by.id('tabAdventuresFind')).tap();
    await element(by.id('adventureTitle')).atIndex(1).tap();
    await element(by.id('ctaGoWithGroup')).tap();
    await element(by.id('ctaGetStartedGroup')).tap();
    await element(by.id('inputName')).replaceText(groupName + randomId);
    await element(by.id('ctaContinue')).tap();
    await element(by.id('releaseOption-1')).swipe('left', 'fast');
    await element(by.id('ctaContinueOption-2')).tap();
    await element(by.id('ctaDatePicker')).tap();

    // Nearest minue that divides by 5. Ex. 13 -> 15
    const newMinuteVal = Math.ceil(moment().minute() / 5) * 5;
    const newDatePickerVal = moment()
      .minute(newMinuteVal)
      .format('YYYY-MM-DD[T]HH:mm:ssZ');
    // '2019-02-06T05:10:00-08:00'
    await element(by.id('datePickerModal')).setDatePickerDate(
      newDatePickerVal,
      'ISO8601',
    );
    await element(by.text('Confirm')).tap();
    await element(by.id('ctaReleaseContinue')).tap();
    await expect(element(by.id('inviteCodeHeader'))).toBeVisible();
  });

  it('should see only first step unlocked', async () => {
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-1'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepLocked').withAncestor(by.id('stepPart-2'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepLocked').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();
  });

  it('should see second step unlocked after 5 mins max', async () => {
    await waitFor(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-2'))),
    )
      .toBeVisible()
      .withTimeout(300000);
    await expect(
      element(by.id('stepLocked').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();
  });

  it('should copy new invite code', async () => {
    await element(by.id('ctaAddMembersEmpty')).tap();
    await element(by.id('ctaNoNotifications')).tap();
    // https://github.com/wix/Detox/blob/DetoxNext/docs/APIRef.ActionsOnElement.md#getAttributes--ios-only
    const attributes = await element(by.id('invitationCode')).getAttributes();
    const inviteCodeTemp = attributes.text.split(': ');
    inviteCode = inviteCodeTemp[1];
    await expect(element(by.id('ctaShareLink'))).toBeVisible();
    // await element(by.id('ctaShareLink')).tap();
    await element(by.id('ctaHeaderDone')).tap();
  });

  it('should see two steps unlocked', async () => {
    await goBackFrom('AdventureManage');
    await goBackFrom('AdventureAvailable');
    await element(by.id('tabAdventuresMy')).tap();
    await element(by.id(inviteCode)).tap();

    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-1'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-2'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepLocked').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();
  });

  it('should be able to leave a message for step 1', async () => {
    await element(by.id('stepPart-1')).tap();
    await element(by.id('inputEnterAnswer')).tap();
    await element(by.id('inputEnterAnswer')).replaceText('Test answer for step 1 from the leader 😀');
    await element(by.id('ctaSendAnswer')).tap();
    await expect(element(by.id('inputMainChatInput'))).toBeVisible();
    await goBackFrom('AdventureStepScreenHeader');
  });

  it('should be able to leave a message for step 2', async () => {
    await element(by.id('stepPart-2')).tap();
    await element(by.id('inputEnterAnswer')).replaceText('Test answer for step 2 from the leader 🥶');
    await element(by.id('ctaSendAnswer')).tap();
    await goBackFrom('AdventureStepScreenHeader');

    await expect(
      element(by.id('nextRelease').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();
  });
  // ===========================================================================
  // Sign out as Leader and Join Adventure as a guest:
  signout();

  it('should be able to sign in as a guest with Adventure Code', async () => {
    await element(by.id('inputAdventureCode')).replaceText(inviteCode);
    await element(by.id('ctaAdventureCodeContinue')).tap();
    await waitFor(element(by.id('inputFirstName')))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id('inputFirstName')).replaceText(secondUserFirstName);
    await element(by.id('inputLastName')).typeText(secondUserlastName);
    await element(by.id('ctaNameContinue')).tap();
    await element(by.id('ctaPhotoContinue')).tap();
    await expect(element(by.id('tabAdventuresMy'))).toBeVisible();

    await element(by.id('tabAdventuresMy')).tap();
    await expect(element(by.id(inviteCode))).toBeVisible();
  });

  it('should be able to leave a message for step 1 (as a second user )', async () => {
    await element(by.id(inviteCode)).tap();
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-1'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-2'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepLocked').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();

    await element(by.id('stepPart-1')).tap();
    await element(by.id('inputEnterAnswer')).tap();
    await element(by.id('inputEnterAnswer')).replaceText('Test answer for step 1 from the second user 😨');
    await element(by.id('ctaSendAnswer')).tap();
    await expect(element(by.id('inputMainChatInput'))).toBeVisible();
    await goBackFrom('AdventureStepScreenHeader');
  });

  it('should be able to leave a message for step 1 (as a second user )', async () => {
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-1'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-2'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepLocked').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();

    await element(by.id('stepPart-2')).tap();
    await element(by.id('inputEnterAnswer')).tap();
    await element(by.id('inputEnterAnswer')).replaceText('Test answer for step 2 from the second user 🤢');
    await element(by.id('ctaSendAnswer')).tap();
    await expect(element(by.id('inputMainChatInput'))).toBeVisible();
    await goBackFrom('AdventureStepScreenHeader');
  });

  it('should see the next release message as a second user', async () => {
    await expect(
      element(by.id('nextRelease').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();
  });

  it('should not be able to progress to a locked step', async () => {
    await element(by.id('stepPart-3')).tap();
    await waitFor(element(by.id('ctaPlayerPlay')))
      .toBeNotVisible()
      .withTimeout(2000);
    await goBackFrom('AdventureActive');
  });

  it('should be able to register as tester and delete account', async () => {
    await element(by.id('iconMenu')).tap();
    await element(by.id('menuCreateAccount')).tap();
    await element(by.id('inputEmail')).replaceText(secondUserEmail);
    await element(by.id('inputPassword')).replaceText(secondUserPass);
    await element(by.id('ctaSignUp')).tap();
    await expect(element(by.id('textEmail'))).toHaveText(secondUserEmail);
    await element(by.id('ctaDeleteAccount')).tap();
    await element(by.text('Delete')).tap();
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
  });

  // ===========================================================================
  // Sign in as a second guest.

  signin(thirdUserEmail, thirdUserPass);

  it('should be able to joing with Adventure Code', async () => {
    await element(by.id('tabAdventuresMy')).tap();
    await element(by.id('ctaHaveCode')).tap();

    await element(by.id('inputAdventureCode')).replaceText(inviteCode);
    await element(by.id('ctaAdventureCodeContinue')).tap();
    await element(by.id('ctaJoinGroup')).tap();
  });

  it('should be able to leave a message for step 1 (as a third user )', async () => {
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-1'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-2'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepLocked').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();

    await element(by.id('stepPart-1')).tap();
    await element(by.id('inputEnterAnswer')).tap();
    await element(by.id('inputEnterAnswer')).replaceText('Test answer for step 1 from the third user 🤯');
    await element(by.id('ctaSendAnswer')).tap();
    await expect(element(by.id('inputMainChatInput'))).toBeVisible();
    await goBackFrom('AdventureStepScreenHeader');
  });

  // 835974


});
