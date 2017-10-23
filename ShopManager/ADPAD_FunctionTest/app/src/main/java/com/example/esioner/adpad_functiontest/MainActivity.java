package com.example.esioner.adpad_functiontest;

import android.app.Dialog;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ImageView;

import com.vortex.pin.Pin;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        findViewById(R.id.iv).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final Dialog dialog = new Dialog(MainActivity.this);
                ImageView iv = new ImageView(MainActivity.this);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    iv.setBackground(getDrawable(R.drawable.header));
                }
                dialog.setContentView(iv);
                iv.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        dialog.dismiss();
                    }
                });
                dialog.show();
            }
        });
//        while (true) {
//            Log.d("HOME", "onCreate: " + Pin.getData("PL4"));
//        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Log.d("ONKEYDOWN", "onKeyDown: " + keyCode);
        return super.onKeyDown(keyCode, event);
    }
}
