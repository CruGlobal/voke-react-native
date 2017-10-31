package org.cru.voke;

import android.app.Application;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration; // For orientation changes
import android.os.Bundle;
import android.support.multidex.MultiDex; // For Multidex support Android <5.0

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

// import com.facebook.react.ReactApplication;
// import com.tkporter.sendsms.SendSMSPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.react.rnspinkit.RNSpinkitPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
// import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
// import com.facebook.react.ReactNativeHost;
// import com.facebook.soloader.SoLoader;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.core.CrashlyticsCore;
import io.fabric.sdk.android.Fabric;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.wix.reactnativenotifications.core.notification.INotificationsApplication;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.IPushNotification;
import com.brentvatne.react.ReactVideoPackage;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends NavigationApplication implements INotificationsApplication {

  private NotificationsLifecycleFacade notificationsLifecycleFacade;

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
          // SendSMSPackage.getInstance(),
          new OrientationPackage(),
          new FBSDKPackage(mCallbackManager),
          new RNDeviceInfo(),
          new RNSpinkitPackage(),
          new ReactNativeContacts(),
          // new ImagePickerPackage(),
          new GoogleAnalyticsBridgePackage(),
          new VectorIconsPackage(),
          new PickerPackage(),
          new RNFetchBlobPackage(),
          new ReactVideoPackage(),
          new RNNotificationsPackage(MainApplication.this)
      );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
      return getPackages();
  }

  @Override
  public void onCreate() {
    super.onCreate();

    FacebookSdk.sdkInitialize(getApplicationContext());

    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);

    // Fabric crashlytics setup
    if (BuildConfig.DEBUG) {
      Fabric.with(this, new Crashlytics.Builder().core(new CrashlyticsCore.Builder().disabled(BuildConfig.DEBUG).build()).build());
    } else {
      Fabric.with(this, new Crashlytics());
    }

    // Create an object of the custom facade impl
    notificationsLifecycleFacade = new NotificationsLifecycleFacade();
    // Attach it to react-native-navigation
    setActivityCallbacks(notificationsLifecycleFacade);

    setActivityCallbacks(new ActivityCallbacks() {

      @Override
      public void onConfigurationChanged(Configuration newConfig) {
         super.onConfigurationChanged(newConfig);
         Intent intent = new Intent("onConfigurationChanged");
         intent.putExtra("newConfig", newConfig);
         sendBroadcast(intent);
      }

      @Override
      public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
      }
    });
  }

  @Override
  public IPushNotification getPushNotification(Context context, Bundle bundle, AppLifecycleFacade defaultFacade, AppLaunchHelper defaultAppLaunchHelper) {
      return new CustomPushNotification(
      	context,
      	bundle,
      	notificationsLifecycleFacade, // Instead of defaultFacade!!!
      	defaultAppLaunchHelper,
      	new JsIOHelper()
    	);
  }

  // This is for multidex applications <5.0
  @Override
  protected void attachBaseContext(Context base) {
     super.attachBaseContext(base);
     MultiDex.install(this);
  }
};
