package com.shopmanager;

import android.app.Application;

import com.apsl.versionnumber.RNVersionNumberPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.fileopener.FileOpenerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rnfs.RNFSPackage;
import com.vortex.pin.Pin;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNVersionNumberPackage(),
                    new FileOpenerPackage(),
                    new ReactVideoPackage(),
                    new RNDeviceInfo(),
                    new RNFSPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        //home
        // Pin.setFunc("PL4", Pin.FUNC_INPUT);
        // Pin.setData("PL4", Pin.DATA_HIGH);

        //miso
        // Pin.setFunc("PC1", Pin.FUNC_OUTPUT);
        // Pin.setData("PC1", Pin.DATA_HIGH);

        //clock
        // Pin.setFunc("PC2", Pin.FUNC_INPUT);
        // Pin.setData("PC2", Pin.DATA_HIGH);

        //msi
        // Pin.setFunc("PC0", Pin.FUNC_OUTPUT);
        // Pin.setData("PC0", Pin.DATA_HIGH);
    }
}
