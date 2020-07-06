package org.cru.voke;

// https://github.com/crazycodeboy/react-native-splash-screen/issues/418
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // Voke: Splash Screen

// Voke: RN Orientation Locker
// https://github.com/wonday/react-native-orientation-locker#android
import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {

  // Voke: Splash Screen
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);  // here
      super.onCreate(savedInstanceState);
  }

  // Voke: Needed for orientation changes
  // https://github.com/wonday/react-native-orientation-locker#android
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
      this.sendBroadcast(intent);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Voke";
  }
}
