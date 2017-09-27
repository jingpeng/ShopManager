package com.shopmanager;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Intent appIntent = context.getPackageManager().getLaunchIntentForPackage("com.shopmanager");
        context.startActivity(appIntent);

    }
}
