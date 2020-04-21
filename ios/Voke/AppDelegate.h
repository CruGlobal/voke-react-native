/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/react-native-community/push-notification-ios#update-appdelegateh
#import <UserNotifications/UNUserNotificationCenter.h>

#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

// @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>



@property (nonatomic, strong) UIWindow *window;

@end
