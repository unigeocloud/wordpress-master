import com.hivext.api.Response;
import org.yaml.snakeyaml.Yaml;
import com.hivext.api.core.utils.Transport;


var cdnAppid = "c05ffa5b45628a2a0c95467ebca8a0b4";
var baseUrl = "https://raw.githubusercontent.com/sych74/wordpress-master";
var cdnText = "Install Lightning-Fast Premium CDN with 130+ PoPs",
    sslText = "Install Let's Encrypt SSL with Auto-Renewal";
var group = jelastic.billing.account.GetAccount(appid, session);

var url = baseUrl + "/configs/settings.yaml";
var settings = toNative(new Yaml().load(new Transport().get(url)));

if (group.groupType == 'trial') {    
    settings.fields.push({
        "type": "compositefield",
        "hideLabel": true,
        "pack": "left",
        "itemCls": "deploy-manager-grid",
        "cls": "x-grid3-row-unselected",
        "items": [{
            "type": "spacer",
            "width": 4
        }, {
            "type": "displayfield",
            "cls": "x-grid3-row-checker x-item-disabled",
            "width": 30,
            "height": 20
        }, {
            "type": "displayfield",
            "cls": "x-item-disabled",
            "value": cdnText
        }]
    }, {
        "type": "compositefield",
        "hideLabel": true,
        "pack": "left",
        "itemCls": "deploy-manager-grid",
        "cls": "x-grid3-row-unselected",
        "items": [{
            "type": "spacer",
            "width": 4
        }, {
            "type": "displayfield",
            "cls": "x-grid3-row-checker x-item-disabled",
            "width": 30,
            "height": 20
        }, {
            "type": "displayfield",
            "cls": "x-item-disabled",
            "value": sslText
        }]
    });    
} else {
    var isCDN = jelastic.dev.apps.GetApp(cdnAppid);
    if (isCDN.result == 0 || isCDN.result == Response.PERMISSION_DENIED) {
        settings.fields.push({
            type: "checkbox",
            name: "cdn-addon",
            caption: cdnText,
            value: true
        });
    }

    var resp = jelastic.billing.account.GetQuotas('environment.externalip.enabled');
    if (resp.result == 0 && resp.array[0].value) {
        settings.fields.push({
            type: "checkbox",
            name: "le-addon",
            caption: sslText,
            value: true
        });
    }
}

return {
    result: 0,
    settings: settings
};
