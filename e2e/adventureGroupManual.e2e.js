// const { lte } = require('lodash');
const { signin, signout } = require('./shortcuts');

/* eslint-disable no-undef */
describe('Group Adventure With Manual Release', () => {
  const groupName = 'Manual Release Group Test - ';
  let inviteCode = '';

  const randomId = Math.floor(Math.random() * 1000) + 1;

  beforeAll(async () => {
    await device.reloadReactNative();
  });

  const waitForToast = async () => {
    // Need it as push notice is covering top of the screen.
    await waitFor(element(by.id('textToast')))
      .toBeVisible()
      .withTimeout(3000);
    await expect(element(by.id('textToast'))).toBeVisible();
  };

  const goBackFrom = async screenTestId => {
    // Need it as push notice is covering top of the screen.
    await waitFor(element(by.id('ctaGoBack').withAncestor(by.id(screenTestId))))
      .toBeVisible()
      .withTimeout(7000);
    await element(by.id('ctaGoBack').withAncestor(by.id(screenTestId))).tap();
  };

  signin();

  it('can tap on "Go with a Group"', async () => {
    await element(by.id('tabAdventuresFind')).tap();
    await element(by.id('adventureTitle')).atIndex(1).tap();
    await element(by.id('ctaGoWithGroup')).tap();
    await expect(element(by.id('ctaGetStartedGroup'))).toBeVisible();
  });

  it('should see "How Groups Work" tutorial only 3 times', async () => {
    await element(by.id('groupTutorial')).swipe('down', 'fast');
    await element(by.id('ctaGoWithGroup')).tap();
    await element(by.id('groupTutorial')).swipe('down', 'fast');
    await element(by.id('ctaGoWithGroup')).tap();
    await element(by.id('groupTutorial')).swipe('down', 'fast');
    await element(by.id('ctaGoWithGroup')).tap();
    await expect(element(by.id('inputName'))).toBeVisible();
  });

  it('can create a Group with manual release mode', async () => {
    await element(by.id('inputName')).replaceText(groupName + randomId);
    await element(by.id('ctaContinue')).tap();
    await element(by.id('releaseOption-1')).swipe('left', 'fast');
    await element(by.id('releaseOption-2')).swipe('left', 'fast');
    await element(by.id('ctaContinueOption-3')).tap();
    await element(by.id('ctaReleaseContinue')).tap();
    await expect(element(by.id('inviteCodeHeader'))).toBeVisible();
  });

  it('should see 1 member at first step and "Release Now!" at second', async () => {
    await expect(element(by.id('allMembersPart-1'))).toHaveText(
      'See all members (1)',
    );
    await expect(
      element(by.id('ctaReleaseNow').withAncestor(by.id('stepPart-2'))),
    ).toBeVisible();
    await expect(element(by.id('lockedPart-3'))).toBeVisible();
  });

  it('should see and copy new invite code', async () => {
    await element(by.id('ctaAddMembersEmpty')).tap();
    await element(by.id('ctaNoNotifications')).tap();
    // https://github.com/wix/Detox/blob/DetoxNext/docs/APIRef.ActionsOnElement.md#getAttributes--ios-only
    const attributes = await element(by.id('invitationCode')).getAttributes();
    const inviteCodeTemp = attributes.text.split(': ');
    inviteCode = inviteCodeTemp[1];
    await expect(element(by.id('ctaShareLink'))).toBeVisible();
    await element(by.id('ctaHeaderDone')).tap();
  });

  it('should see only first step unlocked', async () => {
    await goBackFrom('AdventureManage');
    await goBackFrom('AdventureAvailable');
    await element(by.id('tabAdventuresMy')).tap();
    await element(by.id(inviteCode)).tap();

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

  it('should be able to release the next step', async () => {
    await element(by.id('ctaLeaderZone')).tap();
    await expect(
      element(by.id('ctaReleaseNow').withAncestor(by.id('stepPart-2'))),
    ).toBeVisible();
    await element(by.id('ctaReleaseNow')).tap();
    waitForToast();
    await waitFor(element(by.id('ctaReleaseNow').withAncestor(by.id('stepPart-3'))))
      .toBeVisible()
      .withTimeout(3000);
    await expect(element(by.id('allMembersPart-2'))).toHaveText(
      'See all members (0)',
    );

    await goBackFrom('AdventureManage');
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

  it('should be able to progress to the second step', async () => {
    await element(by.id('stepPart-1')).tap();
    await element(by.id('inputEnterAnswer')).tap();
    /* await expect(
      element(
        by.text('Please watch the video first before you answer. Thanks!'),
      ),
    ).toBeVisible();
    await element(by.id('AdventureStepScreen')).scroll(300, 'up'); */
    // Give video some time to load
    /* await waitFor(element(by.id('ctaPlayerPlay')))
      .toBeVisible()
      .withTimeout(5000); */
    // await element(by.id('ctaPlayerPlay')).tap();
    await element(by.id('inputEnterAnswer')).replaceText('Test answer');
    await element(by.id('ctaSendAnswer')).tap();
    await expect(element(by.id('inputMainChatInput'))).toBeVisible();
    await expect(element(by.id('ctaNextActionText'))).toHaveText(
      'NEXT VIDEO IS READY',
    );
    await element(by.id('ctaNextAction')).tap();
  });

  it('should see user progress', async () => {
    await element(by.id('ctaLeaderZone')).tap();
    await expect(
      element(by.id('ctaReleaseNow').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();
    await expect(element(by.id('allMembersPart-2'))).toHaveText(
      'See all members (1)',
    );
    await element(by.id('ctaReleaseNow')).tap();
    waitForToast();
    await expect(element(by.id('ctaReleaseNow'))).toBeNotVisible();
    await expect(element(by.id('allMembersPart-3'))).toHaveText(
      'See all members (0)',
    );

    await goBackFrom('AdventureManage');
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-1'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-2'))),
    ).toBeVisible();
    await expect(
      element(by.id('stepAvailable').withAncestor(by.id('stepPart-3'))),
    ).toBeVisible();
  });

  it('should be able to progress to the last step', async () => {
    await element(by.id('stepPart-2')).tap();
    await element(by.id('inputEnterAnswer')).replaceText('Test answer 2');
    await element(by.id('ctaSendAnswer')).tap();
    await expect(element(by.id('ctaNextActionText'))).toHaveText(
      'NEXT VIDEO IS READY',
    );
    await element(by.id('ctaNextAction')).tap();

    await element(by.id('stepPart-3')).tap();
    await element(by.id('inputEnterAnswer')).replaceText('Test answer 3');
    await element(by.id('ctaSendAnswer')).tap();
    await expect(element(by.id('finishedAdventure'))).toBeVisible();
    await goBackFrom('AdventureStepScreenHeader');
  });

  it('should see user graduated', async () => {
    await element(by.id('ctaLeaderZone')).tap();
    await expect(element(by.id('allMembersPart-99'))).toHaveText(
      'See all members (1)',
    );
    await expect(element(by.id('ctaReleaseNow'))).toBeNotVisible();
    await goBackFrom('AdventureManage');
    await goBackFrom('AdventureActive');
  });

  signout();
});
