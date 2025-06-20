# Log Details: Threat Tab

The **Threat** tab provides a comprehensive risk assessment of the detected threat. This tab shows how ThreatSense calculated the threat level and what factors contributed to the risk score.

## What You'll See

### Threat Assessment

#### Threat Level
**What it shows:** Overall risk classification of the threat
**How it's calculated:** Based on a scoring system that evaluates multiple risk factors
**Levels:**
- 🔴 **High:** Significant risk - immediate action recommended
- 🟡 **Medium:** Moderate risk - proceed with caution
- 🟢 **Low:** Minimal risk - but still worth monitoring

**Scoring thresholds:**
- **High:** Score of 4 or higher (out of 9 possible points)
- **Medium:** Score of 2-3 points
- **Low:** Score of 0-1 points

#### Threat Score
**What it shows:** Numerical risk score (0-9) with percentage
**How it's calculated:** Points are awarded based on various risk factors
**Example:** "6 points (67%)"
**Why it matters:** Higher scores indicate more dangerous threats

### Threat Score Breakdown
**What it shows:** Detailed breakdown of what contributed to the threat score
**How it's calculated:** Each risk factor is evaluated independently and points are awarded
**Format:** List of factors with points awarded (e.g., "NLP: urgent/suspicious/threat +2")

## How the Scoring System Works

### Risk Factors and Points

#### NLP Analysis Factors (+2 points each)
- **Urgent/Suspicious Language:** "Act now," "Immediate action required," "24 hours to respond"
- **Impersonation/Phishing:** Claims to be from banks, government agencies, tech support
- **Scam Indicators:** "You've won," "Account suspended," "Verify immediately"

#### Behavioral Analysis Factors (+1-2 points each)
- **Unknown Sender:** Sender not in your contacts (+1 point)
- **Scam Pattern Match:** Matches known scam templates (+2 points)
- **Robocall Pattern:** Matches known robocall patterns (+2 points)

#### Sender Analysis Factors (+2 points each)
- **Suspicious Domains:** Fake bank domains, IRS impersonation
- **Random SMS:** Unknown phone numbers with suspicious patterns
- **Known Scam Sources:** Previously identified threat sources

### Maximum Score
- **Total possible points:** 9
- **Percentage calculation:** (Score ÷ 9) × 100
- **Example:** 6 points = 67% risk

## Understanding the Results

### High-Risk Threats (4+ points)
**Characteristics:**
- Multiple red flags across different analysis methods
- Clear scam or phishing indicators
- Suspicious sender with dangerous content
- Urgent language combined with suspicious requests

**Recommended actions:**
- **Immediately block the sender**
- **Do not click any links**
- **Do not provide any personal information**
- **Report the threat**
- **Delete the message**

### Medium-Risk Threats (2-3 points)
**Characteristics:**
- Some suspicious elements but not clearly dangerous
- Unknown sender with potentially legitimate content
- Suspicious timing or context
- Mixed signals from different analysis methods

**Recommended actions:**
- **Verify the sender independently**
- **Be cautious with any links**
- **Don't provide sensitive information**
- **Monitor for similar threats**
- **Consider blocking if suspicious**

### Low-Risk Threats (0-1 points)
**Characteristics:**
- Minimal suspicious indicators
- Known sender with legitimate content
- No urgent language or suspicious requests
- Clean analysis results

**Recommended actions:**
- **Still exercise caution**
- **Verify unusual requests**
- **Report if something feels wrong**
- **Monitor for changes in sender behavior**

## How This Helps You Make Decisions

### Quick Risk Assessment
The threat level gives you an immediate understanding of the risk:
- **High:** Stop and investigate further
- **Medium:** Proceed with caution
- **Low:** Likely safe but stay alert

### Detailed Analysis
The breakdown shows you exactly why the threat was flagged:
- **Which factors** contributed to the risk
- **How many points** each factor earned
- **What patterns** were detected

### Pattern Recognition
By reviewing multiple threats, you can identify:
- **Common scam tactics** targeting you
- **Senders to watch out for**
- **Types of threats** you're most vulnerable to
- **Effectiveness** of your security measures

## Understanding False Positives

### What Causes False Positives
Sometimes legitimate messages get flagged because they:
- **Contain urgent language** for legitimate reasons (e.g., work emergencies)
- **Come from new senders** (e.g., new colleagues, service providers)
- **Include links** to new but legitimate websites
- **Use similar language** to scams (e.g., "verify your account")

### How to Handle False Positives
1. **Check the breakdown** - See which factors triggered the alert
2. **Verify independently** - Contact the sender through known channels
3. **Consider context** - Is this urgent language justified?
4. **Trust your instincts** - If something feels wrong, it probably is
5. **Report if needed** - Help improve the system by reporting false positives

## Tips for Using This Tab

### For High-Risk Threats
1. **Don't panic** - The system caught the threat before it could harm you
2. **Follow recommendations** - Block, report, and delete
3. **Learn from it** - Note what patterns to watch for
4. **Share with others** - Warn friends and family about similar threats

### For Medium-Risk Threats
1. **Investigate further** - Check the breakdown for specific concerns
2. **Verify independently** - Don't rely solely on the threat assessment
3. **Be cautious** - Better safe than sorry
4. **Monitor patterns** - Watch for similar threats

### For Low-Risk Threats
1. **Stay alert** - Low risk doesn't mean no risk
2. **Trust your judgment** - If something feels wrong, investigate
3. **Report if suspicious** - Help improve the detection system
4. **Learn patterns** - Understand what makes threats low-risk

## Continuous Improvement

### How ThreatSense Learns
The system continuously improves by:
- **Analyzing new threats** as they emerge
- **Learning from user reports** of false positives and missed threats
- **Updating threat patterns** based on the latest scams
- **Refining scoring algorithms** for better accuracy

### Your Role in Improvement
You can help improve threat detection by:
- **Reporting false positives** - When legitimate messages are flagged
- **Reporting missed threats** - When dangerous messages aren't caught
- **Providing feedback** - On threat assessments and recommendations
- **Staying informed** - About new types of threats and scams

---

*The threat assessment system is designed to help you make informed decisions about your digital security while minimizing false alarms.* 