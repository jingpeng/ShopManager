package com.shopmanager;

import android.app.KeyguardManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.os.PowerManager;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.KeyEvent;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.vortex.pin.Pin;

public class MainActivity extends ReactActivity {

    private static final String TAG = MainActivity.class.getSimpleName();

    private PowerManager.WakeLock mWakeLock;
    private KeyguardManager.KeyguardLock mKeyguardLock;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //初始化广播接收者
        initReceiver();
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);


        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        mWakeLock = pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.SCREEN_DIM_WAKE_LOCK, "SimpleTimer");

        KeyguardManager km = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
        mKeyguardLock = km.newKeyguardLock("unLock");
    }

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
        if (getReactInstanceManager() != null &&
                getReactInstanceManager().getCurrentReactContext() != null &&
                getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class) != null) {
            getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("on_key_pressed", params);
        }
        if (keyCode == 131) {
            if (mWakeLock != null && mKeyguardLock != null) {
                mWakeLock.acquire();
                mKeyguardLock.disableKeyguard();
            }
        }
        return super.onKeyUp(keyCode, event);
    }

    public void initReceiver() {
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.intent.action.BATTERY_CHANGED");
        registerReceiver(receiver, filter);
    }

    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Bundle bundle = intent.getExtras();
            //获取当前电量信息
            int currentBattery = bundle.getInt("level");
            Log.d(TAG, "onReceive: " + currentBattery);
//            获取总电量
//            int totalBattery = bundle.getInt("scale");
//            Log.d(TAG, "totalBattery: "+totalBattery);
//            int currLevel = (currentBattery/totalBattery)*100/100;
//            Log.d(TAG, "currLevel: "+currLevel);
            if (currentBattery <= 15) {
                Pin.setFunc("PC1", Pin.FUNC_OUTPUT);
                Pin.setData("PC1", Pin.DATA_HIGH);
//                Log.d(TAG, "onReceive: 电量小于15，亮灯");
            } else if (currentBattery >15) {
                Pin.setFunc("PC1", Pin.FUNC_DISABLED);
                Pin.setData("PC1", Pin.DATA_LOW);
//                Log.d(TAG, "onReceive:电量大于15灭灯 ");
            }
        }
    };
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (receiver != null) {
            unregisterReceiver(receiver);
        }
    }
}
