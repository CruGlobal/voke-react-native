package org.cru.voke;

// import com.facebook.react.ReactActivity;
import com.smixx.fabric.FabricPackage;
import com.reactnativenavigation.controllers.SplashActivity;
import android.content.Intent;
import android.content.res.Configuration; // For orientation changes

public class MainActivity extends SplashActivity {
  protected String getMainComponentName() {
      return "Voke";
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
  }

  @Override
     public void onConfigurationChanged(Configuration newConfig) {
       super.onConfigurationChanged(newConfig);
       Intent intent = new Intent("onConfigurationChanged");
       intent.putExtra("newConfig", newConfig);
       this.sendBroadcast(intent);
   }

//   @Override
//   protected void onNewIntent(Intent intent) {
//        setIntent(intent);
//   }

}
// public class MainActivity extends ReactActivity {
//
//     /**
//      * Returns the name of the main component registered from JavaScript.
//      * This is used to schedule rendering of the component.
//      */
//
// }
