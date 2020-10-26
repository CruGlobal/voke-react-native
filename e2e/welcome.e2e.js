describe('Welcome Screen', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should have all the default elements', async () => {
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
    await expect(element(by.id('ctaAdventureCode'))).toBeVisible();
    await expect(element(by.id('ctaExplore'))).toBeVisible();
    await expect(element(by.id('ctaSignIn'))).toBeVisible();
  });

  it('should show more info about Adventure Code', async () => {
    await element(by.id('ctaCodeInfo')).tap();
    await expect(element(by.id('textHaveCode'))).toBeVisible();
    await element(by.id('ctaCodeInfo')).tap();
    await expect(element(by.id('textHaveCode'))).not.toBeVisible();
  });

  it('should be able to go to Sign In', async () => {
    await element(by.id('ctaSignIn')).tap();
    await element(by.id('ctaSignInEmail')).tap();
    await expect(element(by.id('inputEmail'))).toBeVisible();
  });

  it('should be able to go back to Welcome from Sign In', async () => {
    await element(by.id('ctaGoBack')).tap();
    await waitFor(element(by.id('welcomeScreen'))).toBeVisible().withTimeout(2000);
  });

  it('should be able to go to Adventure Code', async () => {
    await element(by.id('ctaAdventureCode')).tap();
    await waitFor(element(by.id('inputAdventureCode'))).toBeVisible().withTimeout(2000);
  });

  it('should be able to go back to Welcome from Adventure Code', async () => {
    await element(by.id('ctaGoBack')).tap();
    await waitFor(element(by.id('welcomeScreen'))).toBeVisible().withTimeout(2000);
  });
});
