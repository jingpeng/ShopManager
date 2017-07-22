package com.shopmanager;

import android.util.Log;
import android.view.KeyEvent;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {

    private static final String TAG = MainActivity.class.getSimpleName();

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ShopManager";
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        WritableMap params = Arguments.createMap();
        params.putInt("keyCode", keyCode);
        Log.e(TAG, String.valueOf(keyCode));
        getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("on_key_pressed", params);
        return super.onKeyUp(keyCode, event);
    }
}
