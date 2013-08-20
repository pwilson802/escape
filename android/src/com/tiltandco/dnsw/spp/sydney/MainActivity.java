package com.tiltandco.dnsw.spp.sydney;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import android.os.Bundle;
import android.app.Activity;
import org.apache.cordova.*;

public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
    	
    	try 
        {
            File dbFile = getDatabasePath("cmsPages.db");
            if(!dbFile.exists()){
                this.copy("cmsPages.db",dbFile.getAbsolutePath());
            }
         } 
         catch (Exception e)
         {
         e.printStackTrace();
         }
    	
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
    //And our copy function:
    void copy(String file, String folder) throws IOException 
     {
      File CheckDirectory;
      CheckDirectory = new File(folder);
      
      String parentPath = CheckDirectory.getParent();

      File filedir = new File(parentPath);
      if (!filedir.exists()) {
          if (!filedir.mkdirs()) {
              return;
          }
      }
            
         InputStream in = this.getApplicationContext().getAssets().open(file);
         File newfile = new File(folder);
         OutputStream out = new FileOutputStream(newfile);
         
         
         byte[] buf = new byte[1024];
         int len; while ((len = in.read(buf)) > 0) out.write(buf, 0, len);
         in.close(); out.close();
     }
}
