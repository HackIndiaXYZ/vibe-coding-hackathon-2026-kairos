def analyze_accounts(
    accounts,
    permissions=None,
    apps=None,
    recovery_methods=None
):
    findings = []

    # -------------------------
    # Rule 1: No 2FA
    # -------------------------
    for account in accounts:

        if not account.has_2fa:

            findings.append({
                "title": "No 2FA Enabled",
                "severity": "high",
                "description":
                f"{account.platform_name} account does not have 2FA enabled.",

                "recommendation":
                "Enable Two-Factor Authentication immediately."
            })

    # -------------------------
    # Rule 2: Too Many Accounts
    # -------------------------
    if len(accounts) > 20:

        findings.append({
            "title": "Excessive Number of Accounts",
            "severity": "low",
            "description":
            "Large number of accounts detected.",

            "recommendation":
            "Review and remove unused accounts."
        })

    # -------------------------
    # Rule 3: Dangerous Permissions
    # -------------------------
    if permissions:

        for permission in permissions:

            if (
                permission.scope.lower()
                in [
                    "full access",
                    "admin",
                    "write",
                    "all"
                ]
            ):

                findings.append({
                    "title": "Excessive Permission Granted",
                    "severity": "high",
                    "description":
                    f"Permission '{permission.scope}' provides extensive access.",

                    "recommendation":
                    "Review and revoke unnecessary permissions."
                })

    # -------------------------
    # Rule 4: Risky Third Party Apps
    # -------------------------
    if apps:

        for app in apps:

            if hasattr(app, "risk_level"):

                if (
                    app.risk_level
                    and app.risk_level.lower() == "high"
                ):

                    findings.append({
                        "title": "Risky Third-Party Application",
                        "severity": "high",
                        "description":
                        f"{app.name} is marked as high risk.",

                        "recommendation":
                        "Consider removing or restricting access."
                    })

    # -------------------------
    # Rule 5: Too Many Recovery Methods
    # -------------------------
    if recovery_methods:

        if len(recovery_methods) > 5:

            findings.append({
                "title": "Too Many Recovery Methods",
                "severity": "medium",
                "description":
                "Multiple recovery methods are linked to accounts.",

                "recommendation":
                "Remove outdated recovery methods."
            })

    # -------------------------
    # Rule 6: Blast Radius
    # -------------------------
    if len(accounts) >= 5:

        findings.append({
            "title": "High Blast Radius",
            "severity": "high",
            "description":
            "One identity is connected to many accounts. A compromise could impact multiple services.",

            "recommendation":
            "Enable strong security controls on primary identities."
        })

    return findings


def calculate_risk_score(findings):

    score = 100

    for finding in findings:

        severity = finding["severity"].lower()

        if severity == "high":
            score -= 20

        elif severity == "medium":
            score -= 10

        elif severity == "low":
            score -= 5

    if score < 0:
        score = 0

    return score