describe('Welcome Screen', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should have all the default elements', async () => {
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
    expect(element(by.id('ctaAdventureCode'))).toBeVisible();
    expect(element(by.id('ctaExplore'))).toBeVisible();
    expect(element(by.id('ctaSignIn'))).toBeVisible();
  });

  it('should be able to go to Sign In', async () => {
    await element(by.id('ctaSignIn')).tap();
    await expect(element(by.id('inputEmail'))).toBeVisible();
  });

  it('should be able to go back to Welcome', async () => {
    await element(by.id('ctaGoBack')).tap();
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
  });

  it('should be able to go to Adventure Code', async () => {
    await element(by.id('ctaAdventureCode')).tap();
    await expect(element(by.id('inputAdventureCode'))).toBeVisible();
  });

  it('should be able to go back to Welcome', async () => {
    await element(by.id('ctaGoBack')).tap();
    await expect(element(by.id('welcomeScreen'))).toBeVisible();
  });



/*
  it('should show adventure code input after tap', async () => {
    await element(by.id('ctaAdventureCode')).tap();
    await expect(element(by.id('inputAdventureCode'))).toBeVisible();
    // await expect(element(by.text('Hello!!!'))).toBeVisible();
  });

  it('should show world screen after tap', async () => {
    await element(by.id('world_button')).tap();
    await expect(element(by.text('World!!!'))).toBeVisible();
  }); */
});
