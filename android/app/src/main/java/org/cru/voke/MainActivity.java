package org.cru.voke;
// https://github.com/zoontek/react-native-bootsplash#android-1
import android.os.Bundle;
import com.facebook.react.ReactActivity;
// https://github.com/zoontek/react-native-bootsplash#android-1
import com.zoontek.rnbootsplash.RNBootSplash;
// https://jeremybarbet.github.io/react-native-modalize/#/INSTALLATION
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
// Voke: RN Orientation Locker
// https://github.com/wonday/react-native-orientation-locker#android
import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {
  // Voke: Splash Screen
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // https://github.com/zoontek/react-native-bootsplash#android-1
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
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

  // React Native Gesture Handler
  // https://docs.swmansion.com/react-native-gesture-handler/docs/#updating-mainactivityjava
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
