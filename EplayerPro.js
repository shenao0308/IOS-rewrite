/*
 * EplayerX & RevenueCat 通用解锁脚本
 */
let body = $response.body;
if (body) {
    let obj = JSON.parse(body);

    const proEntitlement = {
        "is_sandbox": false,
        "ownership_type": "PURCHASED",
        "billing_issues_detected_at": null,
        "grace_period_expires_date": null,
        "expires_date": "2099-12-31T23:59:59Z",
        "purchase_date": "2023-01-01T00:00:00Z",
        "product_identifier": "eplayer.pro.lifetime"
    };

    const proSubscription = {
        "grace_period_expires_date": null,
        "purchase_date": "2023-01-01T00:00:00Z",
        "expires_date": "2099-12-31T23:59:59Z",
        "is_sandbox": false,
        "ownership_type": "PURCHASED",
        "original_purchase_date": "2023-01-01T00:00:00Z",
        "store": "app_store"
    };

    if (obj && obj.subscriber) {
        obj.subscriber.entitlements = obj.subscriber.entitlements || {};
        obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};

        // 针对 EplayerX 代码中涉及的标识符及常规标识
        const targetKeys = [
            "pro", "Pro", "pro_access", "all_access",
            "eplayer.mac.pro.isPro", "eplayer.mac.pro.isAllAccess",
            "eplayer.ios.pro.isPro", "eplayer.ios.pro.isAllAccess",
            "isPro", "isAllAccess", "premium", "VIP"
        ];

        // 1. 如果原始返回里已有任意订阅，强制将其改到 2099 年
        for (let key in obj.subscriber.entitlements) {
            obj.subscriber.entitlements[key].expires_date = "2099-12-31T23:59:59Z";
            obj.subscriber.entitlements[key].purchase_date = "2023-01-01T00:00:00Z";
        }

        // 2. 注入 Pro 权限
        targetKeys.forEach(key => {
            obj.subscriber.entitlements[key] = Object.assign({}, proEntitlement, { product_identifier: key });
            obj.subscriber.subscriptions[key] = proSubscription;
        });
    }

    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
