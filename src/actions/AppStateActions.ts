import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import { startupAction, sleepAction } from '../actions/auth'

/**
 * AppState can tell you if the app is in the foreground or background,
 * and notify you when the state changes.
 */
class AppStateActions {
  appState: string;
  constructor() {
    this.appState = AppState.currentState;
    // Note: currentState will be null at launch while AppState retrieves it.
    this.register();
  }

  register() {
    // This event is received when the app state has changed.
    AppState.addEventListener("change", this.handleAppStateChange);
  };

  destroy() {
    // Clean-up.
    AppState.removeEventListener("change", this.handleAppStateChange);
  };

  // App has come to the foreground!
  appActivated() {
    startupAction();
  };

   // App has come to the background!
  appDeactivated() {
    sleepAction();
  };

  handleAppStateChange(nextAppState: string) {
    console.log( "🐸 this:", this );
    // active | background | inactive [iOS]
    if ( nextAppState === "active"
      && (this.appState === "background" ||  this.appState === "inactive")) {
      // App has come to the foreground!
      this.appActivated();
    } else {
      // background | inactive
      // App has come to the background!
      this.appDeactivated();
    }
    this.appState = nextAppState;
  };
};

const appStateActions = new AppStateActions();
