package com.shopmanager;

import android.app.KeyguardManager;
import android.app.Service;
import android.app.admin.DevicePolicyManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import com.vortex.pin.Pin;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;


public class RayStatusService extends Service {
    private boolean screenStatus;
    private static final String TAG = "RayStatusService";

    BroadcastReceiver screenStatusReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals("android.intent.action.SCREEN_ON")) {
                screenStatus = true;
                Log.d("Pingmu", "onReceive: 屏幕亮");
            } else if (intent.getAction().equals("android.intent.action.SCREEN_OFF")) {
                screenStatus = false;
                Log.d("Pingmu", "onReceive: 屏幕滅");
            }
        }
    };
    private long mFirstTime = new Date().getTime();

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        //开启判断屏幕状态的广播接收者
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.intent.action.SCREEN_ON");
        filter.addAction("android.intent.action.SCREEN_OFF");
        registerReceiver(screenStatusReceiver, filter);
        /**
         * 开启定时器，循环读取当前红外信息
         * 0 表示附近沒人
         * 1 表示附近有人
         */
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                int rayStatus = Pin.getData("PC2");
                Log.d(TAG, "rayStatus: " + rayStatus);
                //当前状态为0，不进行操作
                if (rayStatus == 0) {
                    long endTime = new Date().getTime();
                    if (endTime - mFirstTime > 10000) {
                        closeScreen();
                    } else {

                    }
                }
                //当前状态为1，判断屏幕状态
                else if (rayStatus == 1) {
                    if (screenStatus) {
                    } else {
                        //屏幕关闭的情况下，打开屏幕
                        //开启定时器，设置五分钟
                        openScreen();
                    }
                    mFirstTime = new Date().getTime();
                }
            }
        };
        new Timer().schedule(task, 0, 1000);
        return super.onStartCommand(intent, flags, startId);
    }

    private void openScreen() {
//        //启用屏幕常亮功能
//        pm = (PowerManager) getSystemService(POWER_SERVICE);
//        wakeLock = pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.SCREEN_DIM_WAKE_LOCK, "My Tag");
//        wakeLock.acquire();
        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        PowerManager.WakeLock mWakeLock = pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.SCREEN_DIM_WAKE_LOCK, "SimpleTimer");

        KeyguardManager km = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
        KeyguardManager.KeyguardLock mKeyguardLock = km.newKeyguardLock("unLock");
        mWakeLock.acquire();
        mKeyguardLock.disableKeyguard();
    }

    private void closeScreen() {
        Log.d(TAG, "關閉屏幕");
        ComponentName componentName = new ComponentName(this, AdminReceiver.class);
        DevicePolicyManager manager = (DevicePolicyManager) getSystemService(DEVICE_POLICY_SERVICE);
        if (manager.isAdminActive(componentName)) {
            manager.lockNow();
        } else {
            Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName);
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                    "请打开设备管理器");
            startActivity(intent);
        }
    }

}
