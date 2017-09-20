package org.cru.voke;

import android.app.Application;
import android.app.Activity;
import android.content.Intent;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

// import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
// import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
// import com.facebook.soloader.SoLoader;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.core.CrashlyticsCore;
import io.fabric.sdk.android.Fabric;
import com.reactnative.ivpusic.imagepicker.PickerPackage;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends NavigationApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public boolean isDebug() {
      // Make sure you are using BuildConfig from your own application
      return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          // new MainReactPackage(),
          new FBSDKPackage(mCallbackManager),
          new RNDeviceInfo(),
          new ReactNativePushNotificationPackage(),
          new RNSpinkitPackage(),
          new ReactNativeContacts(),
          // new ImagePickerPackage(),
          new GoogleAnalyticsBridgePackage(),
          new VectorIconsPackage(),
          new PickerPackage(),
          new RNFetchBlobPackage(),
          new RNSoundPackage()
      );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
      return getPackages();
  }

  @Override
  public void onCreate() {
    super.onCreate();

    setActivityCallbacks(new ActivityCallbacks() {
      @Override
      public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
      }
    });

    FacebookSdk.sdkInitialize(getApplicationContext());

    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
    
    // Fabric crashlytics setup
    if (BuildConfig.DEBUG) {
      Fabric.with(this, new Crashlytics.Builder().core(new CrashlyticsCore.Builder().disabled(BuildConfig.DEBUG).build()).build());
    } else {
      Fabric.with(this, new Crashlytics());
    }

  }
};
