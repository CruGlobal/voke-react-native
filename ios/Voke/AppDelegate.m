
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import "Orientation.h"


#import <FBSDKCoreKit/FBSDKCoreKit.h>

#import <React/RCTRootView.h>

@implementation AppDelegate



- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Voke"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor colorWithRed:0.27 green:0.78 blue:0.91 alpha:1.0];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
  [Fabric with:@[[Crashlytics class]]];

  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  return YES;
}

// FOR REACT NATIVE ORIENTATION
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}



- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                openURL:url
                                                      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                             annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                  ];
  // Add any custom logic here.
  return handled;
}


@end
