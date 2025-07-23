# 🐛 Troubleshooting

Common issues and their solutions when using Bonkseus Incinerator.

## 🔗 Wallet Connection Issues

### Problem: "Wallet Not Detected"
**Symptoms**: Wallet button shows "Connect Wallet" but doesn't detect your wallet

**Solutions**:
1. **Install Wallet Extension**: Ensure your wallet extension is installed and enabled
2. **Refresh Browser**: Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. **Check Extension**: Make sure wallet extension is active and unlocked
4. **Try Different Browser**: Some wallets work better in specific browsers

### Problem: "Connection Rejected"
**Symptoms**: Wallet popup appears but connection fails

**Solutions**:
1. **Approve Connection**: Click "Connect" or "Approve" in your wallet popup
2. **Check Permissions**: Ensure the site has permission to connect
3. **Reset Connection**: Disconnect and reconnect your wallet
4. **Update Wallet**: Make sure your wallet extension is up to date

## 💰 Token Detection Issues

### Problem: "No Tokens Found"
**Symptoms**: Platform shows "No tokens found in your wallet"

**Solutions**:
1. **Check Balance**: Ensure you actually have SPL tokens with positive balances
2. **Wait for Loading**: Token detection can take 10-30 seconds
3. **Refresh Connection**: Disconnect and reconnect your wallet
4. **Network Issues**: Check if Solana network is experiencing issues

### Problem: "Tokens Show as 'Unknown'"
**Symptoms**: Your tokens display as "TOKEN_XXXX" instead of proper names

**Solutions**:
- **This is Normal**: New or obscure tokens may not have metadata
- **Still Burnable**: You can still burn these tokens safely
- **Check Mint Address**: Verify the mint address matches your token

## 🔥 Burning Transaction Issues

### Problem: "Transaction Failed"
**Symptoms**: Burn transaction fails or gets rejected

**Solutions**:
1. **Check SOL Balance**: Ensure you have enough SOL for gas fees (0.001-0.01 SOL)
2. **Reduce Amount**: Try burning a smaller amount
3. **Network Congestion**: Wait and try again during lower network usage
4. **Slippage**: Network conditions may have changed

### Problem: "Insufficient Balance"
**Symptoms**: Error saying you don't have enough tokens

**Solutions**:
1. **Check Decimal Places**: Make sure you're not including too many decimals
2. **Use MAX Button**: Click "MAX" to burn your entire balance
3. **Refresh Balances**: Disconnect and reconnect wallet to refresh balances

### Problem: "Transaction Stuck/Pending"
**Symptoms**: Transaction shows as pending for a long time

**Solutions**:
1. **Wait**: Solana transactions can take 30-60 seconds during high traffic
2. **Check Solscan**: Use the transaction link to check status on Solscan
3. **Don't Double-Submit**: Avoid clicking burn button multiple times

## 🎨 Visual/Interface Issues

### Problem: "Cosmic Cursor Not Working"
**Symptoms**: WebGL cursor effects don't appear

**Solutions**:
1. **Enable Hardware Acceleration**: In browser settings, enable hardware acceleration
2. **Update Browser**: Ensure you're using a modern browser version
3. **Check WebGL Support**: Visit webglreport.com to test WebGL support
4. **Disable Extensions**: Some browser extensions can interfere with WebGL

### Problem: "Page Loading Slowly"
**Symptoms**: Platform takes a long time to load

**Solutions**:
1. **Clear Cache**: Clear your browser cache and cookies
2. **Disable Extensions**: Try disabling browser extensions temporarily
3. **Check Internet**: Ensure stable internet connection
4. **Try Incognito**: Test in private/incognito browsing mode

## 🌐 Network & Performance Issues

### Problem: "RPC Errors"
**Symptoms**: Errors mentioning RPC or network issues

**Solutions**:
1. **Try Again**: RPC issues are usually temporary
2. **Check Solana Status**: Visit status.solana.com for network status
3. **Wait and Retry**: Network congestion usually resolves quickly

### Problem: "Slow Token Loading"
**Symptoms**: Token list takes forever to load

**Solutions**:
1. **Be Patient**: Large wallets can take 30-60 seconds to scan
2. **Check Network**: Ensure stable internet connection
3. **Refresh Page**: Try refreshing if stuck for over 2 minutes

## 📱 Social Sharing Issues

### Problem: "Share on X Not Working"
**Symptoms**: Twitter share button doesn't open properly

**Solutions**:
1. **Allow Popups**: Ensure your browser allows popups for the site
2. **Check Twitter**: Make sure you're logged into Twitter/X
3. **Copy Message**: Use "Copy Message" as an alternative

### Problem: "Copy Message Failed"
**Symptoms**: Copy to clipboard doesn't work

**Solutions**:
1. **Browser Permissions**: Allow clipboard access when prompted
2. **Manual Copy**: Select and copy the text manually
3. **Try Different Browser**: Some browsers have clipboard restrictions

## ⚠️ Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `0x1` | Insufficient token balance | Reduce burn amount |
| `0x11` | Invalid mint address | Check token is valid SPL token |
| `0x12` | Token account not found | Ensure you own the token |
| `0x1771` | Insufficient SOL for fees | Add more SOL to wallet |

## 🔧 Browser Compatibility

### Recommended Browsers
- **Chrome/Chromium** (Recommended)
- **Firefox** (Good support)
- **Safari** (Basic support)
- **Edge** (Good support)

### Not Recommended
- **Internet Explorer** (Not supported)
- **Very old browser versions** (May have issues)

## 📞 Getting Additional Help

If you're still experiencing issues:

1. **Check FAQ**: Review our [FAQ section](faq.md)
2. **Community Discord**: Join our Discord for community support
3. **GitHub Issues**: Report bugs on our GitHub repository
4. **Contact Support**: Email support@stellar-incinerator.com

## 🔍 Debugging Information

When reporting issues, please include:
- **Browser and version**
- **Wallet type and version**
- **Error messages** (exact text)
- **Transaction signatures** (if applicable)
- **Steps to reproduce** the issue

## 💡 Prevention Tips

- **Keep Software Updated**: Update browser and wallet regularly
- **Test Small Amounts**: Always test with small amounts first
- **Save Transaction Links**: Keep records of successful burns
- **Monitor Network Status**: Check Solana network status before large burns 

---

*Need more help? Visit [Bonkseus Incinerator](https://solanatokensincinerator-evd2ucu25-devais-projects-c74be0cf.vercel.app) for support!* 