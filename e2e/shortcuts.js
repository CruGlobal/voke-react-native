const defaultEmail = 'autotest@vokeapptest.com';
const defaultPass = '12345678';

exports.signin = (
  { email, pass } = {
    email: defaultEmail,
    pass: defaultPass,
  },
) => {
  it('can Sign In as ' + email + ' with pass ' + pass, async () => {
    await element(by.id('ctaSignIn')).tap();
    await element(by.id('ctaSignInEmail')).tap();
    await element(by.id('inputEmail')).replaceText(email);
    await element(by.id('inputPassword')).replaceText(pass);
    await element(by.id('ctaSignInNow')).tap();
    await waitFor(element(by.id('tabAdventuresMy')))
      .toBeVisible()
      .withTimeout(2000);
    await expect(element(by.id('tabAdventuresMy'))).toBeVisible();
  });
};

/* exports.signup = (
  { email, pass } = {
    email: defaultEmail,
    pass: defaultPass,
  },
) => {
  it('can Sign Up as ' + email + ' with pass ' + pass, async () => {
    await element(by.id('ctaSignIn')).tap();
    await element(by.id('ctaSignInEmail')).tap();
    await element(by.id('inputEmail')).replaceText(email);
    await element(by.id('inputPassword')).replaceText(pass);
    await element(by.id('ctaSignInNow')).tap();
    await waitFor(element(by.id('tabAdventuresMy')))
      .toBeVisible()
      .withTimeout(2000);
    await expect(element(by.id('tabAdventuresMy'))).toBeVisible();
  });
};
 */
exports.signout = () => {
  it('can Sign Out', async () => {
    // Menu > Profile > Logout
    await element(by.id('iconMenu')).tap();
    await waitFor(element(by.id('menuProfile')))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id('menuProfile')).tap();
    await element(by.id('ctaSignOut')).tap();
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
  });
};

exports.waitForToast = async () => {
  // Need it as push notice is covering top of the screen.
  await waitFor(element(by.id('textToast')))
    .toBeVisible()
    .withTimeout(3000);
  await expect(element(by.id('textToast'))).toBeVisible();
};

exports.goBackFrom = async screenTestId => {
  // Need it as push notice is covering top of the screen.
  await waitFor(element(by.id('ctaGoBack').withAncestor(by.id(screenTestId))))
    .toBeVisible()
    .withTimeout(7000);
  await element(by.id('ctaGoBack').withAncestor(by.id(screenTestId))).tap();
};
