if(!window.Cordova){window.Cordova=window.cordova}(function(){var a,d,f,g,c,e,b;b=this;f={};c=0;g=function(i){var h;h="cb"+(c+=1);f[h]=i;return h};e=function(k,l,j){var h,i;h={};i=false;if(typeof l==="function"){i=true;h.success=l}if(typeof j==="function"){i=true;h.error=j}if(i){k.callback=g(h)}return k};a=function(h,j,i){this.dbPath=h;this.openSuccess=j;this.openError=i;if(!h){throw new Error("Cannot create a SQLitePlugin instance without a dbPath")}this.openSuccess||(this.openSuccess=function(){console.log("DB opened: "+h)});this.openError||(this.openError=function(k){console.log(k.message)});this.open(this.openSuccess,this.openError)};a.prototype.openDBs={};a.handleCallback=function(i,h,k){var j;if((j=f[i])!=null){if(typeof j[h]==="function"){j[h](k)}}f[i]=null;delete f[i]};a.prototype.executeSql=function(l,h,k,i){var j;if(!l){throw new Error("Cannot executeSql without a query")}j=e({query:[l].concat(h||[]),path:this.dbPath},k,i);Cordova.exec("SQLitePlugin.backgroundExecuteSql",j)};a.prototype.transaction=function(j,h,k){var i;i=new d(this.dbPath);j(i);return i.complete(k,h)};a.prototype.open=function(j,h){var i;if(!(this.dbPath in this.openDBs)){this.openDBs[this.dbPath]=true;i=e({path:this.dbPath},j,h);Cordova.exec("SQLitePlugin.open",i)}};a.prototype.close=function(j,h){var i;if(this.dbPath in this.openDBs){delete this.openDBs[this.dbPath];i=e({path:this.dbPath},j,h);Cordova.exec("SQLitePlugin.close",i)}};d=function(h){this.dbPath=h;this.executes=[]};d.prototype.executeSql=function(n,h,m,k){var j,l,i;i=this;l=null;if(m){l=function(q){var p,o;o=q;p={rows:{item:function(r){return o.rows[r]},length:o.rows.length},rowsAffected:o.rowsAffected,insertId:o.insertId||null};return m(i,p)}}j=null;if(k){j=function(o){return k(i,o)}}this.executes.push(e({query:[n].concat(h||[]),path:this.dbPath},l,j))};d.prototype.complete=function(o,m){var p,l,i,n,h,k,j;if(this.__completed){throw new Error("Transaction already run")}this.__completed=true;j=this;k=function(q){return o(j,q)};i=function(q){return m(j,q)};p=e({query:["BEGIN;"],path:this.dbPath});l=e({query:["COMMIT;"],path:this.dbPath},k,i);n=[p].concat(this.executes).concat([l]);h={executes:n};Cordova.exec("SQLitePlugin.backgroundExecuteSqlBatch",h);this.executes=[]};b.sqlitePlugin={openDatabase:function(i,l,k,h,j,m){if(l==null){l=null}if(k==null){k=null}if(h==null){h=0}if(j==null){j=null}if(m==null){m=null}return new a(i,j,m)},handleCallback:a.handleCallback}})();