function EmailComposer(){this.resultCallback=null}EmailComposer.ComposeResultType={Cancelled:0,Saved:1,Sent:2,Failed:3,NotSent:4};EmailComposer.prototype.showEmailComposer=function(d,a,g,f,e,b){var c={};if(g){c.toRecipients=g}if(f){c.ccRecipients=f}if(e){c.bccRecipients=e}if(d){c.subject=d}if(a){c.body=a}if(b){c.bIsHTML=b}cordova.exec(null,null,"EmailComposer","showEmailComposer",[c])};EmailComposer.prototype.showEmailComposerWithCB=function(d,c,a,g,f,e,b){this.resultCallback=d;this.showEmailComposer.apply(this,[c,a,g,f,e,b])};EmailComposer.prototype._didFinishWithResult=function(a){this.resultCallback(a)};cordova.addConstructor(function(){if(!window.plugins){window.plugins={}}if(!window.Cordova){window.Cordova=cordova}window.plugins.emailComposer=new EmailComposer()});