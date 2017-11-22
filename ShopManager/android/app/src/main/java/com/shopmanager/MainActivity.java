package com.shopmanager;

import android.app.KeyguardManager;
import android.app.admin.DevicePolicyManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.KeyEvent;
import android.view.WindowManager;

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

        if (judgeAuthority()) {
            //初始化广播接收者
            initReceiver();
            //開啓紅外服務
            startService(new Intent(this, RayStatusService.class));
        }

        WindowManager manager = (WindowManager) getSystemService(WINDOW_SERVICE);
        Log.d("屏幕宽高", "宽度: " + manager.getDefaultDisplay().getWidth());
        Log.d("屏幕宽高", "高度: " + manager.getDefaultDisplay().getHeight());
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
        //当按压home 键的时候，点亮屏幕
        if (keyCode == 122) {
            if (mWakeLock != null && mKeyguardLock != null) {
                mWakeLock.acquire();
                mKeyguardLock.disableKeyguard();
            }
        }
        return super.onKeyUp(keyCode, event);
    }

    /**
     * 检验权限
     */
    private boolean judgeAuthority() {
        boolean internetOk = false;
        boolean adminAuthority = false;
        /**
         * 判断是否联网
         */
        if (!isConnect()) {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("网络连接失败");
            builder.setMessage("网络连接失败，请联网重新打开软件");
            builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    finish();
                }
            });
            builder.setPositiveButton("打开wifi", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    Intent intent = new Intent(Settings.ACTION_WIFI_SETTINGS);
                    startActivity(intent);
                    finish();
                }
            });
            builder.show();
        } else {
            internetOk = true;
        }
        //判断管理员权限
        ComponentName componentName = new ComponentName(this, AdminReceiver.class);
        DevicePolicyManager manager = (DevicePolicyManager) getSystemService(DEVICE_POLICY_SERVICE);
        if (manager.isAdminActive(componentName)) {
            adminAuthority = true;
        } else {
            Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName);
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                    "请打开设备管理器");
            startActivity(intent);
        }

        if (internetOk && adminAuthority) {
            return true;
        } else {
            return false;
        }
    }

    //判断网络是否已连接
    public boolean isConnect() {
        boolean isConnect = false;
        ConnectivityManager manager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        NetworkInfo info = manager.getActiveNetworkInfo();
        if (info != null) {
            if (info.isConnected()) {
                isConnect = true;
            } else {
                isConnect = false;
            }
        }
        return isConnect;
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
            } else if (currentBattery > 15) {
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
