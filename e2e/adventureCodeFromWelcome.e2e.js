describe('Welcome > Have an Adventure Code', () => {
  const adventureCode = '605444';
  const firstName = 'Automated';
  const lastName = 'Testvoke';

  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should error when entering wrong Adventure Code', async () => {
    await element(by.id('ctaAdventureCode')).tap();
    await waitFor(element(by.id('inputAdventureCode')))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id('inputAdventureCode')).typeText('333');
    await element(by.id('ctaAdventureCodeContinue')).tap();
    await waitFor(element(by.id('textToast')))
      .toHaveText('Invalid code')
      .withTimeout(2000);
    // await expect(element(by.id('textToast'))).toHaveText('Invalid Code');
  });

  it('should be able to input Adventure Code', async () => {
    await element(by.id('inputAdventureCode')).replaceText(adventureCode);
    await element(by.id('ctaAdventureCodeContinue')).tap();
    await waitFor(element(by.id('inputFirstName')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should error when entering wrong Name', async () => {
    // await element(by.id('inputFirstName')).replaceText(adventureCode);
    await element(by.id('ctaNameContinue')).tap();
    await element(by.text('OK')).tap();
    await expect(element(by.id('inputFirstName'))).toBeVisible();
  });

  it('should be able to input Name', async () => {
    await element(by.id('inputFirstName')).replaceText(firstName);
    await element(by.id('inputLastName')).typeText(lastName);
    await element(by.id('ctaNameContinue')).tap();
  });

  it('should be able to see Photo Screen', async () => {
    await expect(element(by.id('iconCamera'))).toBeVisible();
    await element(by.id('ctaPhotoContinue')).tap();
  });

  it('should be able to see Adventures', async () => {
    await expect(element(by.id('tabAdventuresMy'))).toBeVisible();
  });

  it('should be able to see Menu', async () => {
    await element(by.id('iconMenu')).tap();
    await expect(element(by.id('menuProfile'))).toBeVisible();
  });

  it('should be able to go to Profile', async () => {
    await element(by.id('menuProfile')).tap();
    await expect(element(by.id('screenProfile'))).toBeVisible();
  });

  it('should have right name in the Profile', async () => {
    await expect(element(by.id('textFullName'))).toHaveText(
      firstName + ' ' + lastName,
    );
  });

  it('should be able to register with Email', async () => {
    await element(by.id('ctaSignUpEmail')).tap();
    await element(by.id('inputEmail')).replaceText(
      'automatedtest@vokeapptest.com',
    );
    await element(by.id('inputPassword')).replaceText('12345678');
    await element(by.id('ctaSignUp')).tap();
    await expect(element(by.id('textEmail'))).toHaveText(
      'automatedtest@vokeapptest.com',
    );
  });

  it('should be able to Delete Account', async () => {
    await element(by.id('ctaDeleteAccount')).tap();
    await element(by.text('Delete')).tap();
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
  });
});
