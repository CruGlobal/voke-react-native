package org.cru.voke;

// import android.app.Application;
// import android.app.Activity;
// import android.content.Intent;
// import android.content.res.Configuration;
//
// import java.util.Arrays;
// import java.util.List;

import android.content.Context;
import android.os.Bundle;

import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.PushNotification;

public class CustomPushNotification extends PushNotification {

    public CustomPushNotification(Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade, AppLaunchHelper appLaunchHelper, JsIOHelper jsIoHelper) {
        super(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper);
    }
}
