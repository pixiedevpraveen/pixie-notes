package pixiedevs.pixie.com;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        bridge.getWebView().setVerticalScrollBarEnabled(false);
    }
}
