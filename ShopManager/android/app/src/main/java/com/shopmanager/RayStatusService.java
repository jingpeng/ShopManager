package com.shopmanager;

import android.app.KeyguardManager;
import android.app.Service;
import android.app.admin.DevicePolicyManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.PowerManager;
import android.util.Log;

import com.vortex.pin.Pin;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;


public class RayStatusService extends Service {
    private boolean screenStatus;
    private static final String TAG = "RayStatusService";
    public static final int GET_DEVICE_MANAGER_PERMISSION = 100;
    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case GET_DEVICE_MANAGER_PERMISSION:
                    getPermissionDeviceManager((ComponentName) msg.obj);
                    break;
                default:
            }
        }
    };

    BroadcastReceiver screenStatusReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals("android.intent.action.SCREEN_ON")) {
                screenStatus = true;
                mStartTime = new Date().getTime();
                Log.d("Pingmu", "onReceive: 屏幕亮");
            } else if (intent.getAction().equals("android.intent.action.SCREEN_OFF")) {
                screenStatus = false;
                Log.d("Pingmu", "onReceive: 屏幕滅");
            }
        }
    };
    private long mStartTime = new Date().getTime();

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
                    if (endTime - mStartTime > 5 * 60 * 1000) {
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
                    mStartTime = new Date().getTime();
                }
            }
        };
        new Timer().schedule(task, 0, 1000);
        return super.onStartCommand(intent, flags, startId);
    }

    private void openScreen() {
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

            Message msg = new Message();
            msg.obj = componentName;
            msg.what = GET_DEVICE_MANAGER_PERMISSION;
            mHandler.sendMessage(msg);

        }
    }

    //检测获取设备管理器权限
    private void getPermissionDeviceManager(ComponentName componentName) {
        Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName);
        intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                "请打开设备管理器");
        startActivity(intent);
    }
}
