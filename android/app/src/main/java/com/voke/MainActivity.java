package com.voke;

import com.facebook.react.ReactActivity;
import android.content.Intent; // Voke: Needed for orientation changes
import android.content.res.Configuration; // Voke: Needed for orientation changes

public class MainActivity extends ReactActivity {

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
